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
        "change .scoreRow select": "_renderScoreUpdate"
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

            $p1Score = $(scoreRow).find('select').first();
            $p2Score = $(scoreRow).find('select').last();

            if ($p1Score.val() === self.model.get('points') && $p2Score.val() !== '') {
                winningScore = $p1Score.val();
                winningId = p1Id;
                losingScore = $p2Score.val();
                losingId = p2Id;
            } else if ($p2Score.val() === self.model.get('points') && $p1Score.val() !== '') {
                winningScore = $p2Score.val();
                winningId = p2Id;
                losingScore = $p1Score.val();
                losingId = p1Id;
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

                self.oldCollection = self.collection;
                
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

    showPlayerSelectModal: function() {
        $('#playerSelectModal').modal('show');
    },
    handlePlayerSelect: function(e) {
        var $selectedPlayer = $(e.target),
            player1,
            player2;

        if ($selectedPlayer.hasClass('active')) {
            $selectedPlayer.removeClass('active');

        } else {
            $selectedPlayer.addClass('active');

            //if we are entering the second player then close modal and update players
            if ($selectedPlayer.siblings('.active').length == 1) {
                $('#playerSelectModal').modal('hide');

                player1 = this.collection.where({competitor_id: $selectedPlayer.attr('data-competitorId')})[0];
                player2 = this.collection.where({competitor_id: $selectedPlayer.siblings('.active').attr('data-competitorId')})[0];
                $('#selectPlayer1').attr('data-competitor_id', player1.get('competitor_id'));
                $('#selectPlayer2').attr('data-competitor_id', player2.get('competitor_id'));
                $('#selectPlayer1 span').html(player1.get('name'));
                $('#selectPlayer2 span').html(player2.get('name'));

                //randomise pictures
                $('#selectPlayer1 img').attr('src', "img/win_left_" + (Math.floor(Math.random() * 2) + 1) + ".png");
                $('#selectPlayer2 img').attr('src', "img/win_right_" + (Math.floor(Math.random() * 2) + 1) + ".png");
            }
        }
    },
    
    render: function() {

        var array = this.collection.models;

        this.$el.html(this.navbarTemplate(this.model.toJSON()));
        this.$el.append(this.gameTemplate(this.model.toJSON()));
        this._renderNewScoreRow();

        array.sort(function(a,b){return a.attributes.name < b.attributes.name ? -1 : a.attributes.name > b.attributes.name ? 1 : 0;});
        this._renderPlayerSelect();
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
    }
});