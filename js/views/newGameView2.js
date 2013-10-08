Vs.NewGameView2 = Backbone.View.extend({   

    gameTemplate : _.template($('#newGame2Template').html()),    
    scoreTemplate : _.template($('#newScoreTemplate').html()),    
	el: $('#mainContainer'),
	
    initialize: function () {},

	events : {
        "click #addScore": "_renderScoreRow",
        "click #submitScore": "makeGame",
    },
    
    makeGame: function() {
    	var winnerSelect = this.$el.find('#winner');
    	var w = winnerSelect.get(0); 
    	var winner_id = w[w.selectedIndex].value;
    	var loserSelect = this.$el.find('#loser');
    	var l = loserSelect.get(0); 
    	var loser_id = l[l.selectedIndex].value;

    	var winner_score = 11;
    	
    	var loserSelect = this.$el.find('#loser_score');
    	var l = loserSelect.get(0); 
    	var loser_score = l[l.selectedIndex].value;
    	
    	var game = new Vs.GameSaver();
    	game.fetch({
    		data: {model:
    				{competition_id: this.model.id, 
    				results: [
    					{competitor_id: winner_id, rank: '1', score: winner_score},
						{competitor_id: loser_id, rank: '2', score: loser_score}]}},
    		success: function(collection, response) {
    			Vs.router.refreshCompetition();	
    		},
    		error: function(collection, response) {
    			console.log(response);
    		}
    		});
    },
    
    render: function() {

        var array = this.collection.models;

        this.$el.html(this.gameTemplate(this.model.toJSON()));
        this._renderScoreRow();

        array.sort(function(a,b){return a.attributes.name < b.attributes.name ? -1 : a.attributes.name > b.attributes.name ? 1 : 0});
        this._renderCompetitorRows();
    },

    _renderCompetitorRows: function() {

        this.collection.each(function(game) {
            var cr = new Vs.CompetitorSelectionRow({model: game});
            $('#player1').append(cr.render().el);
            $('#player2').append(cr.render().el);
        });
    },

    _renderScoreRow: function() {
        $('#scoresSection').append(this.scoreTemplate());
    }
});