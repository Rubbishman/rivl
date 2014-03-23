Vs.CompetitorStatView = Backbone.View.extend({

    template : _.template($('#playerPageTemplate').html()),
    navbarTemplate : _.template($('#navbarTemplate').html()),
	statRowTemplate : _.template($('#playerStatRowTemplate').html()),
	gameViewTemplate : _.template($('#gameViewTemplate').html()),
	competitorGameRowTemplate : _.template($('#competitorGameRowTemplate').html()),
    selectedCompetitorId : -1,
    events: {
        'click #showRivlStatsOverflow': 'toggleRivlStatsOverflow'
    },

    initialize: function () {
        $mainPage = $("#mainContainer");
        el = $("#mainContainer");

        /*$(document).on('mouseout', '#previousGameBars', function () {
            $('#previousGameBarDetails').html('');
        });*/
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
        ctx.translate(0.5, 0.5);
        
        var self = this;
        function getMousePos(canvas, evt) {
	        var rect = canvas.getBoundingClientRect();
	        return {
	          x: evt.clientX - rect.left,
	          y: evt.clientY - rect.top
	        };
      	}
        
        canvas.addEventListener('mousemove', function(evt) {
        	$('#notesArea').hide();
        	var mousePos = getMousePos(canvas, evt);
        	ctx.clearRect(-1, -1, canvas.width+1, canvas.height+1);
        	
        	var mouseBlockX = (mousePos.x - (mousePos.x % 20));

            self.selectedCompetitorId = self.model.attributes.gameHistory[mouseBlockX/20].opponent_id;

        	if(mouseBlockX/20 < self.model.attributes.gameHistory.length && self.model.attributes.gameHistory[mouseBlockX/20].competitor_elo_change > 0) {
        		ctx.fillStyle = "#D0FFCF";
        	} else if(mouseBlockX/20 < self.model.attributes.gameHistory.length) {
        		ctx.fillStyle = "#FFCFD0";
        	} else {
        		self.renderEloBar();
        		return;
        	}
        	
        	ctx.fillRect(mouseBlockX+1,0,18,50);
        	
        	self.renderEloBar();
        	
        	ctx.strokeStyle = "#999";
        	ctx.beginPath();
        	ctx.moveTo(mouseBlockX+1,0);
        	ctx.lineTo(mouseBlockX+1,49);
        	ctx.lineTo(mouseBlockX+19,49);
        	ctx.lineTo(mouseBlockX+19,0);
        	ctx.lineTo(mouseBlockX+1,0);
        	ctx.closePath();
        	ctx.stroke();
        	
        	$('#previousGameBarDetails').html(self.gameViewTemplate(self.model.attributes.gameHistory[mouseBlockX/20]));
        	
        	if(self.model.attributes.gameHistory[mouseBlockX/20].notes != undefined){
        		_.each(self.model.attributes.gameHistory[mouseBlockX/20].notes, function(value) {
        			$('#notesArea').show();
        			$('#noteAnchor').append('<div class="notesContents">' + value.note + '</div>');
        		});
        	}
        	
        	// $('#previousGameBarEloHover').html(self.model.attributes.gameHistory[mouseBlockX/20].competitor_elo_change);
      	}, false);
        
        this.renderEloBar();
        
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
    renderEloBar: function () {
    	var canvas = document.getElementById("previousGameBars"),
    	ctx = canvas.getContext("2d"),
    	self = this;
        
        	var curIndex = 0;
        	var curWidth = 20;
        	var maxEloChange = 0;
        	
        	
        $.each(this.model.attributes.gameHistory, function(index, curGame) {
        	if(maxEloChange < Math.abs(curGame.competitor_elo_change)) {
        		maxEloChange = Math.abs(curGame.competitor_elo_change);
        	}
        });
        
        var heightModifier = 25/maxEloChange;
        
        $.each(this.model.attributes.gameHistory, function(index, curGame) {

	            if(index > 25) {
	                return;
	            }

            if(self.selectedCompetitorId == self.model.attributes.gameHistory[index].opponent_id) {
                ctx.fillStyle = '#DDDDDD';
                ctx.fillRect(curIndex*curWidth, 0,curWidth,50);
            }

		      if(curGame.competitor_elo_change < 0) {
		      	ctx.fillStyle = '#FC9797';
		      } else {
		      	ctx.fillStyle = '#87DF87';
		      }
        	ctx.fillRect(curIndex*curWidth, 25,curWidth,curGame.competitor_elo_change*-heightModifier);
        	
        	// ctx.lineWidth = 0.5;
        	ctx.strokeStyle = "#FFF";

        	ctx.beginPath();
		      ctx.moveTo(curIndex*curWidth, 25);
		      ctx.lineTo(curIndex*curWidth, 25+curGame.competitor_elo_change*-heightModifier);
		      ctx.stroke();

		      ctx.beginPath();
		      ctx.moveTo(curIndex*curWidth+curWidth, 25+curGame.competitor_elo_change*-heightModifier);
		      ctx.lineTo(curIndex*curWidth+curWidth, 25);
		      ctx.stroke();
		      
        	curIndex++;
            // self.renderGameHistory(self.model.attributes, curGame);
        });
		
		ctx.strokeStyle = "#999";
		ctx.lineWidth = 1;

		ctx.beginPath();
		ctx.moveTo(1, 25);
		ctx.lineTo(499, 25);
		ctx.stroke();
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