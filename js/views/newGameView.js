Vs.NewGameView = Backbone.View.extend({   

	template : _.template($('#newGameTemplate').html()),            
    tagName : "li",
	//el: $("#newGame"),
	
    initialize: function () {},

	events : {
		"click #makeGame": "makeGame"
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

        this.$el.html(this.template(this.model.toJSON()));
        $el = this.$el;
        var array = this.collection.models;

        array.sort(function(a,b){return a.attributes.name < b.attributes.name ? -1 : a.attributes.name > b.attributes.name ? 1 : 0});
        this.collection.each(this._renderRow);
        return this;
    },

    _renderRow: function(game) {
        var cr = new Vs.CompetitorSelectionRow({model: game});
        $el.find('#winner').append(cr.render().el);
        $el.find('#loser').append(cr.render().el);
    }
});