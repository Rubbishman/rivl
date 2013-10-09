Vs.NewGameView2 = Backbone.View.extend({   

    gameTemplate : _.template($('#newGame2Template').html()),    
    scoreTemplate : _.template($('#newScoreTemplate').html()),    
	el: $('#mainContainer'),
	
    initialize: function () {},

	events : {
        "click #addScore": "_renderNewScoreRow",
        "click #submitScore": "saveGames",
        "change .scoreRow select": "_renderScoreUpdate"
    },
    
    saveGames: function() {

        var self = this,
            gameModels = [],
            winningScore,
            losingScore,
            winningId,
            losingId,
            scoresOk = true,
            $scoreRows = $('.scoreRow'),
            $p1Score = $('.scoreRow'),
            $p2Score = $('.scoreRow'),
            $p1Name = $('#player1'),
            $p2Name = $('#player2');

        if ($p1Name.val() == '' || $p2Name.val() == '') {
            alert('need to enter both playerz yo');
            return;
        }

        _.each($scoreRows, function(scoreRow) {

            if (!scoresOk) {
                return;
            }

            $p1Score = $(scoreRow).find('select').first();
            $p2Score = $(scoreRow).find('select').last();

            if ($p1Score.val() == '11' && $p2Score.val() != '') {
                winningScore = $p1Score.val();
                winningId = $p1Name.val();
                losingScore = $p2Score.val();
                losingId = $p2Name.val();
            } else if ($p2Score.val() == '11' && $p1Score.val() != '') {
                winningScore = $p2Score.val();
                winningId = $p2Name.val();
                losingScore = $p1Score.val();
                losingId = $p1Name.val();
            } else {
                scoresOk = false;
            }
            
            var newGameModel = {
                competition_id: self.model.id, 
                results: [
                    {competitor_id: winningId, rank: '1', score: winningScore},
                    {competitor_id: losingId, rank: '2', score: losingScore}
                ]
            };
            gameModels.push(newGameModel);
        });

        if (!scoresOk) {
            alert('enter the scorez correctly yo.');
            return;
        }

        
    	var games = new Vs.GameSaver();
    	games.fetch({
            data: { gameModels: gameModels },
    		success: function(collection, response) {
    			self.render();
    		},
    		error: function(collection, response) {
    			console.log(response);
    		}
		});
    },
    
    render: function() {

        var array = this.collection.models;

        this.$el.html(this.gameTemplate(this.model.toJSON()));
        this._renderNewScoreRow();

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

    _renderNewScoreRow: function() {
        $('#scoresSection').append(this.scoreTemplate());
    },

    _renderScoreUpdate: function(e) {

        var $changedScore = $(e.target),
            $p1Score = $(e.target).parents('.scoreRow').find('select').first(),
            $p2Score = $(e.target).parents('.scoreRow').find('select').last(),
            winner;

        if ($changedScore.hasClass('scoreP1')) {
            if ($changedScore.val() == '11') {
                winner = "P1";
                $p2Score.val('');
            } else {
                winner = "P2";
                $p2Score.val('11');
            }
        } else {
            if ($changedScore.val() == '11') {
                winner = "P2";
                $p1Score.val('');
            } else {
                winner = "P1";
                $p1Score.val('11');
            }
        }

        if (winner == 'P1') {
            $p2Score.parent().removeClass('winningScore').addClass('losingScore');
            $p1Score.parent().removeClass('losingScore').addClass('winningScore');
        } else {
            $p2Score.parent().removeClass('losingScore').addClass('winningScore');
            $p1Score.parent().removeClass('winningScore').addClass('losingScore');
        }
    }
});