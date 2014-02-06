Vs.NewGameView2 = Backbone.View.extend({

    navbarTemplate : _.template($('#navbarTemplate').html()),
    gameTemplate : _.template($('#newGame2Template').html()),
    scoreTemplate : _.template($('#newScoreTemplate').html()),
    resultsTemplate : _.template($('#newResultsTemplate').html()),
    playerSelectRowTemplate : _.template($('#newPlayerSelectRowTemplate').html()),
    el: $('#mainContainer'),
    
    initialize: function () {},

    events : {
        "click #addScore": "_renderNewScoreRow",
        "click #removeScore": "_deleteScoreRow",
        "click #submitScore": "saveGames",
        "click #selectPlayer1 img, #selectPlayer2 img": "showPlayerSelectModal",
        "click .playerSelection": "handlePlayerSelect",
        "change .scoreRow select": "_renderScoreUpdate", //do we still need this?
        "click .scoreRow button:not(.dropdown-toggle)": "selectWinner",
        "click .scoreRow .dropdown-menu a": "selectLoserScore"
    },
    
    saveGames: function() {

        if ($("#submitScore").hasClass('btn-disabled')) {
            return;
        }
        console.log('continuing...');

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
            p1Id =  $('#selectPlayer1').attr('data-competitor_id'),
            p2Id =  $('#selectPlayer2').attr('data-competitor_id');

        if (p1Id === '' || p2Id === '') {
            alert('need to enter both playerz yo');
            return;
        }

        $('#submitScore').addClass('btn-disabled').removeClass('btn-success');

        _.each($scoreRows, function(scoreRow) {

            if (!scoresOk) {
                return;
            }

            $p1Score = $(scoreRow).find('.player1Btn').find('.glyphicon-ok').length > 0 ? self.model.get('points') : -1;
            $p2Score = $(scoreRow).find('.player2Btn').find('.glyphicon-ok').length > 0 ? self.model.get('points') : -1;

			if($p1Score < 0 && $p2Score < 0 || $p1Score > 0 && $p2Score > 0) {
				scoresOk = false;
			} else {
				
				if($p1Score === self.model.get('points')) {
					winningScore = $p1Score;
					winningId = p1Id;
					losingScore = $p2Score;
					losingId = p2Id;
				} else {
					winningScore = $p2Score;
					winningId = p2Id;
					losingScore = $p1Score;
					losingId = p1Id;
				}
				scoresOk = true;
			}

            // if ($p1Score.val() === self.model.get('points') && $p2Score.val() !== '') {
                // winningScore = $p1Score.val();
                // winningId = p1Id;
                // losingScore = $p2Score.val();
                // losingId = p2Id;
            // } else if ($p2Score.val() === self.model.get('points') && $p1Score.val() !== '') {
                // winningScore = $p2Score.val();
                // winningId = p2Id;
                // losingScore = $p1Score.val();
                // losingId = p1Id;
            // } else {
                // scoresOk = false;
            // }
            
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

		Vs.router._fetchCompetitors(self.model.get('id'), function() {
			self.oldCollection = Vs.competitors;
		});

        var games = new Vs.GameSaver();

        games.fetch({
            data: { gameModels: gameModels },
            success: function(collection, response) {

                Vs.router._fetchCompetitors(self.model.get('id'), function() {

                    self.collection = Vs.competitors;

                    var p1OldModel = self.oldCollection.where({'competitor_id': p1Id})[0],
                        p1NewModel = self.collection.where({'competitor_id': p1Id})[0],
                        p2OldModel = self.oldCollection.where({'competitor_id': p2Id})[0],
                        p2NewModel = self.collection.where({'competitor_id': p2Id})[0];

                    self.oldCollection = self.collection;
                    self._renderResults({
                        p1eloDelta: self._getDelta('elo', p1OldModel, p1NewModel),
                        p2eloDelta: self._getDelta('elo', p2OldModel, p2NewModel),
                        p1rankDelta: self._getDelta('rank', p1NewModel, p1OldModel),
                        p2rankDelta: self._getDelta('rank', p2NewModel, p2OldModel),
                        p1name: p1NewModel.get('name'),
                        p2name: p2NewModel.get('name'),
                        p1rank: p1NewModel.get('rank'),
                        p2rank: p2NewModel.get('rank')
                    });
                });


            },
            error: function(collection, response) {
                console.log(response);
            }
        });
    },

    _getDelta: function(index, model1, model2) {
        var diff = model2.get(index) - model1.get(index);
        return Math.round(diff * 10) / 10;
    },

    showPlayerSelectModal: function(e) {
        var competitorId = $(e.target).parent().attr('data-competitor_id');
        $('#playerSelectModal').modal('show');

        //unset clicked on player (if exists)
        if (competitorId) {
            $('.playerSelection[data-competitor_id="'+competitorId + '"]').removeClass('active');
        }

    },
    handlePlayerSelect: function(e) {
        var $selectedPlayer = $(e.target),
            player1,
            player2,
            playerA,
            playerB,
            foundA = false,
            foundB = false;

        if ($selectedPlayer.hasClass('active')) {
            $selectedPlayer.removeClass('active');
        } else {
            $selectedPlayer.parent().children().removeClass('active');
            $selectedPlayer.addClass('active');

            if($selectedPlayer.parent().attr('id') == "left_player_select") {
            	playerA = this.collection.where({competitor_id: $selectedPlayer.attr('data-competitor_id')})[0];
            	this._setPlayer('1', playerA);
            } else {
            	playerB = this.collection.where({competitor_id: $selectedPlayer.attr('data-competitor_id')})[0];
            	this._setPlayer('2', playerB);
            }
            
            if($('#left_player_select').children('.active').length == 1 
            	&& $('#right_player_select').children('.active').length == 1) {
            		$('#playerSelectModal').modal('hide');
        	}
        }
    },
    _getImage: function(name, direction, result) {
        var code = name.charCodeAt(0);
        if (name === 'Geraldine' || name === 'Gerard') {
            return result + "_" + direction + "_girl.png";
        } else {
            return result + "_" + direction + "_" + ((code % 5)+1) + ".png";
        }
    },
    _setPlayer: function(playerNumber, playerModel) {

        if(Vs.competition.get('id') == 2) {
            if (playerNumber === '1') {
                $('#selectPlayer1').attr('data-competitor_id', playerModel.get('competitor_id'));
                //$('#selectPlayer1 span').html("<a href='#competition/" + this.model.get('id') + "/competitor_home/" + playerModel.get('competitor_id') + "'>" + playerModel.get('name') + "</a>");
                $('#selectPlayer1 span').html(playerModel.get('name'));
                $('#selectPlayer1 img').attr('src', "img/avatars/" + Vs.competition.get('id') + "_" + playerModel.get('competitor_id') + "_1"+"?ver=3");

            } else {
                $('#selectPlayer2').attr('data-competitor_id', playerModel.get('competitor_id'));
                //$('#selectPlayer2 span').html("<a href='#competition/" + this.model.get('id') + "/competitor_home/" + playerModel.get('competitor_id') + "'>" + playerModel.get('name') + "</a>");
                $('#selectPlayer2 span').html(playerModel.get('name'));
                $('#selectPlayer2 img').attr('src', "img/avatars/" + Vs.competition.get('id') + "_" + playerModel.get('competitor_id') + "_1"+"?ver=3");
            }
        } else {
            if (playerNumber === '1') {
                $('#selectPlayer1').attr('data-competitor_id', playerModel.get('competitor_id'));
                //$('#selectPlayer1 span').html("<a href='#competition/" + this.model.get('id') + "/competitor_home/" + playerModel.get('competitor_id') + "'>" + playerModel.get('name') + "</a>");
                $('#selectPlayer1 span').html(playerModel.get('name'));
                $('#selectPlayer1 img').attr('src', "img/avatars/" + this._getImage(playerModel.get('name'), 'left', 'win'));

            } else {
                $('#selectPlayer2').attr('data-competitor_id', playerModel.get('competitor_id'));
                //$('#selectPlayer2 span').html("<a href='#competition/" + this.model.get('id') + "/competitor_home/" + playerModel.get('competitor_id') + "'>" + playerModel.get('name') + "</a>");
                $('#selectPlayer2 span').html(playerModel.get('name'));
                $('#selectPlayer2 img').attr('src', "img/avatars/" + this._getImage(playerModel.get('name'), 'right', 'win'));
            }
        }
    },
    
    render: function(competitorId) {

        var array = this.collection.models;

        this.$el.html(this.navbarTemplate(this.model.toJSON()));
        this.$el.append(this.gameTemplate(this.model.toJSON()));

        this._renderNewScoreRow();

        array.sort(function(a,b){return a.attributes.name < b.attributes.name ? -1 : a.attributes.name > b.attributes.name ? 1 : 0;});
        this._renderPlayerSelect();

        if (competitorId) {
            $('.playerSelection[data-competitor_id="'+competitorId + '"]').addClass('active');
            player1 = this.collection.where({competitor_id:competitorId})[0];
            this._setPlayer('1', player1);
        }
    },
    _renderPlayerSelect: function() {
        var self = this;
        _.each(this.collection.models, function(competitor) {
            $('#playerSelectModal ul').append(self.playerSelectRowTemplate(competitor.attributes));
        });
    },
    _deleteScoreRow: function() {
        $('#scoresSection').children().last().remove();
    },
    _renderNewScoreRow: function() {
        $('#resultsSection').html('');
        $('#submitScore').removeClass('btn-disabled').addClass('btn-success');
        $('#scoresSection').append(this.scoreTemplate({points: this.model.get('points')}));
    },

    _renderResults: function(results) {
        $('#scoresSection').html('');
        $('#resultsSection').html(this.resultsTemplate(results));

        //update images
        if (results.p1eloDelta < 0) {
            if(Vs.competition.get('id') == 2) {
                $('#selectPlayer1 img').attr('src', "img/avatars/" + Vs.competition.get('id') + "_" + playerModel.get('competitor_id') + "_0"+"?ver=3");
            } else {
                $('#selectPlayer1 img').attr('src', "img/avatars/" + this._getImage(results.p1name, 'left', 'lose'));
            }
        } else {
            if(Vs.competition.get('id') == 2) {
                $('#selectPlayer2 img').attr('src', "img/avatars/" + Vs.competition.get('id') + "_" + playerModel.get('competitor_id') + "_0"+"?ver=3");
            } else {
                $('#selectPlayer2 img').attr('src', "img/avatars/" + this._getImage(results.p2name, 'right', 'lose'));
            }
        }
    },

    _renderScoreUpdate: function(e) {

        var $changedScore = $(e.target),
            $p1Score = $(e.target).parents('.scoreRow').find('select').first(),
            $p2Score = $(e.target).parents('.scoreRow').find('select').last(),
            winner;

        if ($changedScore.hasClass('scoreP1')) {
            if ($changedScore.val() == this.model.get('points')) {
                winner = "P1";
                $p2Score.val('');
            } else {
                winner = "P2";
                $p2Score.val(this.model.get('points'));
            }
        } else {
            if ($changedScore.val() == this.model.get('points')) {
                winner = "P2";
                $p1Score.val('');
            } else {
                winner = "P1";
                $p1Score.val(this.model.get('points'));
            }
        }

        if (winner == 'P1') {
            $p2Score.parent().removeClass('winningScore').addClass('losingScore');
            $p1Score.parent().removeClass('losingScore').addClass('winningScore');
        } else {
            $p2Score.parent().removeClass('losingScore').addClass('winningScore');
            $p1Score.parent().removeClass('winningScore').addClass('losingScore');
        }
    },

    selectWinner: function (e) {
        
        var $winner = $(e.target),
            $loser,
            supportsLosingScore = false,
            supportsWinningScore = false; //we may not ever want to do this...

        //allow for clicking on the icon
        if($winner.hasClass('glyphicon')) {
            $winner = $winner.parent();
        }

        if (supportsLosingScore === true) {

            if ($winner.hasClass('player1Btn')) {
                $loser = $winner.closest('.scoreRow').find('.player2Btn');
            } else {
                $loser = $winner.closest('.scoreRow').find('.player1Btn');
            }

            $winner.removeClass('btn-default btn-loser')
                .addClass('btn-primary')
                .removeAttr('data-toggle')
                .html('<span class="glyphicon glyphicon-ok"></span> Winner');

            $loser.removeClass('btn-primary btn-default')
                .addClass('btn-loser dropdown-toggle')
                .attr('data-toggle','dropdown')
                .html('Loser\'s score <span class="glyphicon glyphicon-chevron-down"></span>');

            //massive hack
            setTimeout(function(){
                $loser.closest('.btnGroupWrap').addClass('btn-group open');
            }, 100);

            //TODO: put all the btn-group and associated classes/attributes 
            //      conditions in the template rather than in here?
            //      We'd still need conditional JS too.
            

        } else {
        //when NOT entering a loser's score 

            if ($winner.hasClass('player1Btn')) {
                $loser = $winner.closest('.scoreRow').find('.player2Btn');
                var $parent = $loser.parent().parent();
            } else {
                $loser = $winner.closest('.scoreRow').find('.player1Btn');
                var $parent = $loser.parent().parent();
            }

            $winner.removeClass('btn-default btn-loser')
                .addClass('btn-primary')
                .html('<span class="glyphicon glyphicon-ok"></span> Winner');

            $loser.removeClass('btn-primary btn-default')
                .addClass('btn-loser')
                .html('<span class="glyphicon glyphicon-remove"></span> Loser');

        }

    },

    selectLoserScore : function (e) {

        var scoreText = $(e.target).html(),
            score = $(e.target).attr('data-score');

        $(e.target).closest('.btn-group').find('button').html(scoreText + ' <span class="glyphicon glyphicon-chevron-down"></span>');

    }

});




