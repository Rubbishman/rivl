Vs.GameHistoryView = Backbone.View.extend({

    template : _.template($('#competitionTemplate').html()),   
    gamePairTemplate : _.template($('#gameRowTemplate').html()),
    gamePairShortFormTemplate : _.template($('#gameRowShortFormTemplate').html()),            
    longFormMode: false,
    initialize: function () {
        $mainPage = $('#gameHistory');
    },
    render: function() {

        var self = this;
            
        $mainPage.html('');

		$('#gameHistoryYesterdayContent').hide();
    	$('#gameHistoryTodayContent').hide();
    	$('#noGameHistory').show();

        this.collection.each(function(game) {
           	self._renderRow({game: game});
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
    	var $gameRowP1,
    		$gameRowP2,
    		$template;
    		
    	if(this.longFormMode) {
    		$template = this.gamePairTemplate;
    	} else { 
    		$template = this.gamePairShortFormTemplate;
    	}
    	
    	if(gamePair.game.get('today') == true) {
    		$('#gameHistoryToday').append($template({p1: gamePair.game.get('p1'), p2: gamePair.game.get('p2')}));
    		$gameRowP1 = $('#gameHistoryToday .player1Link').last();
    		$gameRowP2 = $('#gameHistoryToday .player2Link').last();
    	} else {
    		$('#gameHistoryYesterday').append($template({p1: gamePair.game.get('p1'), p2: gamePair.game.get('p2')}));
    		$gameRowP1 = $('#gameHistoryYesterday .player1Link').last();
    		$gameRowP2 = $('#gameHistoryYesterday .player2Link').last();
    	}
    	
    	$gameRowP1.bind('click', { competition_id: Vs.competition.get('id'), opponent_id: gamePair.game.get('p1').id }, function(event) {
		    var data = event.data;
		    Vs.router.navigate('competition/' + data.competition_id + '/competitor_home/' + data.opponent_id, true);
		});
    	$gameRowP2.bind('click', { competition_id: Vs.competition.get('id'), opponent_id: gamePair.game.get('p2').id }, function(event) {
		    var data = event.data;
		    Vs.router.navigate('competition/' + data.competition_id + '/competitor_home/' + data.opponent_id, true);
		});
    }
});