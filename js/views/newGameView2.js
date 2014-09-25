Vs.NewGameView2 = Backbone.View.extend({

    navbarTemplate : _.template($('#navbarTemplate').html()),
    gameTemplate : _.template($('#newGame2Template').html()),
    scoreTemplate : _.template($('#newScoreTemplate').html()),
    resultsTemplate : _.template($('#newResultsTemplate').html()),
    playerSelectRowTemplate : _.template($('#newPlayerSelectRowTemplate').html()),
    el: $('#mainContainer'),

    initialize: function () {},

    events : {
        "click .addScore": "_renderNewScoreRow",
        "click #removeScore": "_deleteScoreRow",
        "click #submitScore": "saveGames",
        "click #addNote": "addNote",
        "click #removeNote": "removeNote",
        "click #selectPlayer1 img, #selectPlayer2 img": "showPlayerSelectModal",
        "click .playerSelection": "handlePlayerSelect",
        "change .scoreRow select": "_renderScoreUpdate", //do we still need this?
        "click .scoreRow button:not(.dropdown-toggle)": "selectWinner",
        "click .scoreRow .dropdown-menu a": "selectLoserScore"
    },
    addNote: function() {
    	$('#addNote').parent().append('<br><div id="noteArea">Note: <textarea class="btn-block" type="text" name="note" id="notesValue"/></div>');
    	$('#addNote').hide();
    	$('#removeNote').show();
    },
    removeNote: function() {
    	$('#addNote').show();
    	$('#removeNote').hide();
    	$('#noteArea').remove();
    },
    saveGames: function() {

        if ($("#submitScore").hasClass('btn-disabled')) {
            return;
        }

        $('#addNote').show();
    	$('#removeNote').hide();
    	$('#noteArea').remove();

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
            p2Id =  $('#selectPlayer2').attr('data-competitor_id'),
            notes = $('#notesValue'),
            p1winCount = 0,
            p2winCount = 0;

        if (p1Id === '' || p2Id === '') {
            alert('need to enter both playerz yo');
            return;
        }

        $('#submitScore').addClass('btn-disabled').removeClass('btn-success');
        $('#removeScore').hide();

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
                    p1winCount++;
				} else {
					winningScore = $p2Score;
					winningId = p2Id;
					losingScore = $p1Score;
					losingId = p1Id;
                    p2winCount++;
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



        //if this is a tournament match, then upload scores to challonge
        if (this.model.get('tournament')) {

            if ((p1winCount > 0 || p2winCount > 0) && p1winCount != p2winCount) {
                var params = this.model.get('tournament'),
                    winnerId = p1winCount > p2winCount ? params.p1Id : params.p2Id,
                    score = p1winCount > p2winCount ? p1winCount + '-' + p2winCount : p2winCount + '-' + p1winCount;

                Vs.tournament.enterResult(params.id, params.matchId, winnerId, score);

                //if this is the last round in the tournament, then submit a second result for the second double elimination round
                if (params.finalRoundId) {
                    Vs.tournament.enterResult(params.id, params.finalRoundId, winnerId, score);
                }
            } else {
                alert('enter the tournament scorez correctly yo.');
                return;
            }
        }


        var games = new Vs.GameSaver();

		ajaxData = { gameModels: gameModels };

		if(notes.size() > 0) {
			ajaxData.note = notes.val()
		}

        games.fetch({
            data: ajaxData,
            success: function(collection, response) {

                //if tournament mode, then redirect back to tournament page
                if (self.model.get('tournament')) {
                    var url = 'competition/' + Vs.competition.get('id') + "/tournament/" + self.model.get('tournament').id;
                    Vs.router.navigate(url, {trigger: true});
                }

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
                        p2rank: p2NewModel.get('rank'),
                        p1id: p1NewModel.get('competitor_id'),
                        p2id: p2NewModel.get('competitor_id')
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

        //disallow player select for tournament games
        if (this.model.get('tournament')) {
            return false;
        }

        var competitorId = $(e.target).parent().attr('data-competitor_id');
        $('#playerSelectModal').modal('show');

        //unset clicked on player (if exists)
        if (competitorId) {
            var playerId = $(e.target).parent().attr('id'),
                $playerEl = $('.playerSelection[data-competitor_id="'+competitorId + '"]');

            $playerEl.removeClass('active');
            if (playerId === 'selectPlayer1') {
                $playerEl.removeClass('player1select');
            } else {
                $playerEl.removeClass('player2select');
            }
        }

    },
    handlePlayerSelect: function(e) {
        var $selectedPlayer = $(e.target),
            player1selected = $('.player1select').length,
            player2selected = $('.player2select').length,
            player1,
            player2,
            playerA,
            playerB;

        if ($selectedPlayer.hasClass('active')) {
            $selectedPlayer.removeClass('active');
            $selectedPlayer.removeClass('player1select');
            $selectedPlayer.removeClass('player2select');

        } else if (!player1selected) {

            $selectedPlayer.addClass('active');
            $selectedPlayer.addClass('player1select');

        	playerA = this.collection.where({competitor_id: $selectedPlayer.attr('data-competitor_id')})[0];
        	this._setPlayer('1', playerA);

        } else if (!player2selected) {

            $selectedPlayer.addClass('active');
            $selectedPlayer.addClass('player2select');

            playerB = this.collection.where({competitor_id: $selectedPlayer.attr('data-competitor_id')})[0];
            this._setPlayer('2', playerB);
        }
        
        $('#playerSelectModal').modal('hide');
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
        if (playerNumber === '1') {
            $('#selectPlayer1').attr('data-competitor_id', playerModel.get('competitor_id'));
            $('#player1Btn').html(playerModel.get('name'));
            $('#selectPlayer1 img').attr('src', "img/avatars/2_" + playerModel.get('competitor_id') + "_1.png"+"?ver=10");

        } else {
            $('#selectPlayer2').attr('data-competitor_id', playerModel.get('competitor_id'));
            $('#player2Btn').html(playerModel.get('name'));
            $('#selectPlayer2 img').attr('src', "img/avatars/2_" + playerModel.get('competitor_id') + "_1.png"+"?ver=10");
        }
        $('#winnerBtns').show();
    },
    renderTournament: function(tournamentId, matchId) {

        var self = this,
            participants = this.tournament.get('participants').participant,
            matches = this.tournament.get('matches').match,
            match,
            p1Id,
            p2Id;

        //get the correct match from the tournament
        _.each(matches, function(curMatch) {
            if (curMatch.id === matchId) {
                self.match = curMatch;
            }
        });

        //get the correct competitors for the match
        _.each(participants, function(curParticipant) {

            if (curParticipant['id'] === self.match['player1-id']) {
                var rivlUser = Vs.competitors.where({challonge_username: curParticipant['challonge-username']});
                if (rivlUser.length === 0) rivlUser = Vs.competitors.where({email: curParticipant['name']});
                self.p1Id = rivlUser.length > 0 ? rivlUser[0].get('competitor_id') : '';
            }
            if (curParticipant['id'] === self.match['player2-id']) {
                var rivlUser = Vs.competitors.where({challonge_username: curParticipant['challonge-username']});
                if (rivlUser.length === 0) rivlUser = Vs.competitors.where({email: curParticipant['name']});
                self.p2Id = rivlUser.length > 0 ? rivlUser[0].get('competitor_id') : '';
            }
        });

        //check for finalRoundId
        var finalRoundId = self.match['finalRoundId'] || false;

        //set tournament attributes on the model
        this.model.set('tournament', {
            name: this.tournament.get('name'),
            id: this.tournament.get('id'),
            matchId: self.match['id'],
            finalRoundId: finalRoundId,
            p1Id: self.match['player1-id'],
            p2Id: self.match['player2-id']
        });

        self.render(self.p1Id, self.p2Id);
    },
    render: function(competitorId, competitorId2) {

        var array = this.collection.models;

        if (!this.model.get('tournament')) this.model.set('tournament', false);

        this.$el.html(this.navbarTemplate(this.model.toJSON()));
        this.$el.append(this.gameTemplate(this.model.toJSON()));

		$('#removeNote').hide();

        //this._renderNewScoreRow();

        array.sort(function(a,b){return a.attributes.name < b.attributes.name ? -1 : a.attributes.name > b.attributes.name ? 1 : 0;});
        this._renderPlayerSelect();

        if (competitorId) {
            $('.playerSelection[data-competitor_id="'+competitorId + '"]').addClass('active');
            player1 = this.collection.where({competitor_id:competitorId})[0];
            this._setPlayer('1', player1);
        }
        if (competitorId2) {
            $('.playerSelection[data-competitor_id="'+competitorId2 + '"]').addClass('active');
            player2 = this.collection.where({competitor_id:competitorId2})[0];
            this._setPlayer('2', player2);
        }
    },
    _renderPlayerSelect: function() {
        var self = this;
        _.each(this.collection.models, function(competitor) {
            if (competitor.get('activeRank')) {
                $('#playerSelectModal ul').append(self.playerSelectRowTemplate(competitor.attributes));
            }
        });
        $('#playerSelectModal ul').append('<hr />');
        _.each(this.collection.models, function(competitor) {
            if (!competitor.get('activeRank')) {
                $('#playerSelectModal ul').append(self.playerSelectRowTemplate(competitor.attributes));
            }
        });
    },
    _deleteScoreRow: function() {
        var gameRows = $('#scoresSection .scoreRow').length,
            $lastScore = $('#scoresSection .scoreRow:last');

        if (gameRows === 1) {
            $('#submitScore').addClass('btn-disabled').removeClass('btn-success');
            $('#removeScore').hide();
        }

        $lastScore.remove();

    },
    _renderNewScoreRow: function(e) {

        var winner = $(e.currentTarget).attr('id'); //either p1Win or p2Win

        //TODO: use above 'winner' variable to populate incoming score row with correct winner
        this.selectWinner({
            target:
                $('#scoresSection').append(
                    this.scoreTemplate({points: this.model.get('points')})
                ).find('.scoreRow').last().find('.'+winner)});

        //enable save btn. assumes that a game row can only have been added when also electing a winner
        $('#submitScore').removeClass('btn-disabled').addClass('btn-success').show();
        $('#removeScore').show();

    },

    _renderResults: function(results) {
        $('#scoresSection').html('');
        $('#resultsSection').html(this.resultsTemplate(results));

        //update images
        if (results.p1eloDelta < 0) {
            if(Vs.competition.get('id') == 2) {
                $('#selectPlayer1 img').attr('src', "img/avatars/" + Vs.competition.get('id') + "_" + results.p1id + "_0"+"?ver=10");
            } else {
                $('#selectPlayer1 img').attr('src', "img/avatars/" + this._getImage(results.p1name, 'left', 'lose'));
            }
        } else {
            if(Vs.competition.get('id') == 2) {
                $('#selectPlayer2 img').attr('src', "img/avatars/" + Vs.competition.get('id') + "_" + results.p2id + "_0"+"?ver=10");
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
