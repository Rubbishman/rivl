Vs.GameHistoryView = Backbone.View.extend({

    template : _.template($('#competitionTemplate').html()),   
    gamePairTemplate : _.template($('#gameRowTemplate').html()),            
    
    initialize: function () {
        $mainPage = $('#gameHistory');
    },

    render: function() {

        var lastGame,
            self = this;
        $mainPage.html('');

        this.collection.each(function(game) {
            if (lastGame && lastGame.get('game_id') == game.get('game_id')) {
                self._renderRow({game1: lastGame.attributes, game2: game.attributes});
            } else {
                lastGame = game;
            }
        });
        return this;
    },

    _renderRow: function(gamePair) {
        $mainPage.append(this.gamePairTemplate(gamePair));
    }

});