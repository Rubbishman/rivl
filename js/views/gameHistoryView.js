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

		$('#gameHistoryYesterdayContent').hide();
    	$('#gameHistoryTodayContent').hide();
    	$('#noGameHistory').show();

        this.collection.each(function(game) {
            if (lastGame && lastGame.get('game_id') == game.get('game_id')) {
                self._renderRow({game1: lastGame.attributes, game2: game.attributes});
            } else {
                lastGame = game;
            }
        });
        
    	if($('#gameHistoryYesterday').html() != ''){
    		$('#gameHistoryYesterdayContent').show();
    		$('#noGameHistory').hide();
    	}
    	if($('#gameHistoryToday').html() != ''){
    		$('#gameHistoryTodayContent').show();
    		$('#noGameHistory').hide();
    	}
        return this;
    },

    _renderRow: function(gamePair) {
    	
    	if(gamePair.game1.today == true){
    		$('#gameHistoryToday').append(this.gamePairTemplate(gamePair));
    	} else {
    		$('#gameHistoryYesterday').append(this.gamePairTemplate(gamePair));
    	}
    }
});