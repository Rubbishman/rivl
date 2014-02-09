Vs.CompetitorStatView = Backbone.View.extend({

    template : _.template($('#playerPageTemplate').html()),
    navbarTemplate : _.template($('#navbarTemplate').html()),
	statRowTemplate : _.template($('#playerStatRowTemplate').html()),
	competitorGameRowTemplate : _.template($('#competitorGameRowTemplate').html()),
    
    events: {
        'click #showRivlStatsOverflow': 'toggleRivlStatsOverflow'
    },

    initialize: function () {
        $mainPage = $("#mainContainer");
        el = $("#mainContainer");
    },
    
    render: function() {
        var self = this;
        console.dir(this.model.toJSON());
        $("#mainContainer").html(this.navbarTemplate(this.competition.toJSON()));
        $("#mainContainer").append(this.template(this.model.toJSON()));
        $.each(this.model.attributes.stat_details.stat_array,this.renderPlayerStatRow);
        
        //This needs to be made cleaner
        $.each(this.model.attributes.recentGames, function(index, value){
        	$('#recentGame_'+index).bind('click', { competition_id: Vs.competition.get('id'), 
	        	opponent_id: value.opponent_id }, function(event) {
			    var data = event.data;
			    Vs.router.navigate('competition/' + data.competition_id + '/competitor_home/' + data.opponent_id, true);
			});
        });
        
        var canvas = document.getElementById("previousGameBars");
		var ctx = canvas.getContext("2d");
		      
        	var curIndex = 0;
        	var curWidth = 10;
        	var maxEloChange = 0;
        	
        	
        $.each(this.model.attributes.gameHistory, function(index, curGame) {
        	if(maxEloChange < Math.abs(curGame.competitor_elo_change)) {
        		maxEloChange = Math.abs(curGame.competitor_elo_change);
        	}
        });
        
        ctx.fillStyle = '#EEE';
        ctx.fillRect(0,0,500,50);
        
        var heightModifier = 25/maxEloChange;
        
        $.each(this.model.attributes.gameHistory, function(index, curGame) {
		      if(curGame.competitor_elo_change < 0) {
		      	ctx.fillStyle = '#FC9797';
		      } else {
		      	ctx.fillStyle = '#87DF87';
		      }
        	ctx.fillRect(curIndex*curWidth, 25,curWidth,curGame.competitor_elo_change*-heightModifier);
        	
        	// ctx.lineWidth = 0.5;
        	ctx.strokeStyle = "#CCC";
        	
        	ctx.beginPath();
		      ctx.moveTo(curIndex*curWidth, 25);
		      ctx.lineTo(curIndex*curWidth, 25+curGame.competitor_elo_change*-heightModifier);
		      ctx.stroke();
		      
		      ctx.beginPath();
		      ctx.moveTo(curIndex*curWidth, 25+curGame.competitor_elo_change*-heightModifier);
		      ctx.lineTo(curIndex*curWidth+10, 25+curGame.competitor_elo_change*-heightModifier);
		      ctx.stroke();
		      
		      ctx.beginPath();
		      ctx.moveTo(curIndex*curWidth+10, 25+curGame.competitor_elo_change*-heightModifier);
		      ctx.lineTo(curIndex*curWidth+10, 25);
		      ctx.stroke();
		      
        	curIndex++;
            // self.renderGameHistory(self.model.attributes, curGame);
        });
		
		ctx.strokeStyle = "#999";
		
		ctx.beginPath();
		ctx.moveTo(0, 25);
		ctx.lineTo(500, 25);
		ctx.stroke();
			
		ctx.lineWidth = 1;
			ctx.beginPath();
        ctx.moveTo(0, 0);
		      ctx.lineTo(500, 0);
		      ctx.stroke();
		      ctx.beginPath();
		 ctx.moveTo(0, 50);
		      ctx.lineTo(500, 50);
		      ctx.stroke(); 
		      ctx.beginPath();    
		  ctx.moveTo(500, 0);
		      ctx.lineTo(500, 50);
		      ctx.stroke();
		      ctx.beginPath();
			ctx.moveTo(0, 0);
		      ctx.lineTo(0, 50);
		      ctx.stroke();
        /*mainGraph = $("#playerGraph").get(0).getContext("2d");
		data = {
			labels : this.model.attributes.labels,
			datasets : this.model.attributes.data
		};
        options = {'pointDot' : false };
		myNewChart = new Chart(mainGraph).Line(data,options);
        */
        $(document).scrollTop(0);

        var rivls = $('#playerStats .rivlsStatsRow'),
            rivlsCount = rivls.length,
            limit = 5;
        
        if (rivlsCount > limit) {
            rivls.slice(limit, rivlsCount).wrapAll("<div id='rivlStatsOverflow'></div>");
            $('#playerStats').append('<button class="btn btn-default btn-sm" id="showRivlStatsOverflow">+ show more</button>')
        }
        
        return this;
    },
    toggleRivlStatsOverflow: function () {

        var $container = $('#rivlStatsOverflow'),
            $toggle = $('#showRivlStatsOverflow');
        if ($container.is(':hidden')) {
            $container.slideDown('fast');
            $toggle.html('- show less').addClass('toggleOn').removeClass('toggleOff');
        } else {
            $container.slideUp('fast');
            $toggle.html('+ show more').addClass('toggleOff').removeClass('toggleOn');
        }
    },
    renderPlayerStatRow: function() {
    	$("#playerStats").append(Vs.competitorStatView.statRowTemplate(this));
    	$('#playerStats .playerLink').last().bind('click', { competition_id: Vs.competition.get('id'), opponent_id: this.opponent_id }, function(event) {
		    var data = event.data;
		    Vs.router.navigate('competition/' + data.competition_id + '/competitor_home/' + data.opponent_id, true);
		});
    },
    renderGameHistory: function(model, game) {
        game.vsPlayer = game.loser_name !== model.playerName ? game.loser_name : game.winner_name;
        game.vsScore = game.loser_name !== model.playerName ? game.loser_score : game.winner_score;
        game.playerScore = game.loser_name !== model.playerName ? game.winner_score : game.loser_score;
        game.playerElo = game.loser_name !== model.playerName ? game.winner_elo_change : game.loser_elo_change;
        //console.dir(model);
    	$("#playerHistory").append(Vs.competitorStatView.competitorGameRowTemplate(game));
    	$('#playerHistory .playerLink').last().bind('click', { competition_id: Vs.competition.get('id'), opponent_id: game.opponent_id }, function(event) {
		    var data = event.data;
		    Vs.router.navigate('competition/' + data.competition_id + '/competitor_home/' + data.opponent_id, true);
		});
    }
});

/*
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
 */