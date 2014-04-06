
$(function () {

    //define the route and function maps for this router
    Vs.Router = Backbone.Router.extend({

        routes: {
            "competition_graph/:id" : "showCompetitionGraph",
            "competition/:id/competitor_home/:id" : "showCompetitorHome",
            "competition" : "showAllCompetitions",
            "competition/:id" : "showCompetition",
            "competition/:id/game" : "showNewGame",
            "competition/:id/game/:competitorId" : "showNewGame",
            "competition/:id/game/:competitorId/:competitorId2" : "showNewGame",
            "competition/:id/tournament/game/:tournamentId/:matchId" : "showNewTournamentGame",
            "competition/:id/tournament" : "showTournament",
            "*other"    : "showAllCompetitions"
        },

        //constructor
        initialize : function () {

        },
        showCompetitionGraph: function(competition_id) {
            Vs.competitionGraph = new Vs.CompetitionGraph();
            Vs.competitionGraph.fetch({
                data: { competition_id: competition_id},
                success: function(model, response)  {

                    if(!Vs.competition || Vs.competition.id != competition_id) {
                        Vs.router._fetchCompetition(competition_id, function(){
                            Vs.competitionGraphView.competition = Vs.competition;
                            Vs.competitionGraphView.model = model;
                            Vs.competitionGraphView.render();
                        });
                    } else {
                        Vs.competitionGraphView.competition = Vs.competition;
                        Vs.competitionGraphView.model = model;
                        Vs.competitionGraphView.render();
                    }
                },
                error: function(model, response) {
                    console.log(response);
                }
            });
        },
        showCompetitorHome: function(competition_id,competitor_id) {
            Vs.competitorStat = new Vs.CompetitorStat();

            Vs.competitorStat.fetch({
                data: {competition_id: competition_id, competitor_id: competitor_id},
                success: function(model, response)  {

                    if(!Vs.competition || Vs.competition.id != competition_id) {
                        Vs.router._fetchCompetition(competition_id, function(){
                            Vs.competitorStatView.competition = Vs.competition;
                            Vs.competitorStatView.model = model;
                            Vs.competitorStatView.render();
                        });
                    } else {
                        Vs.competitorStatView.competition = Vs.competition;
                        Vs.competitorStatView.model = model;
                        Vs.competitorStatView.render();
                    }
                },
                error: function(model, response) {
                    console.log(response);
                }
            });
        },
        refreshCompetition: function() {
            Vs.competitionView = new Vs.CompetitionView({model: Vs.competition});
            Vs.competitionView.render();

            Vs.router._fetchCompetitors(Vs.competition.get('id'), function() {

                Vs.competitorView = new Vs.CompetitorView({el:$("#competitors"),model: Vs.competition, collection: Vs.competitors});
                Vs.competitorView.render();
            });

            Vs.router._fetchTitles(Vs.competition.get('id'), function() {
            	Vs.titleView = new Vs.TitleView({el:$('#titleSection'),model: Vs.competition, collection: Vs.titles});
            	Vs.titleView.render();
            });

            Vs.router._fetchGames(Vs.competition.get('id'), function() {
                Vs.gameHistoryView = new Vs.GameHistoryView({model: Vs.competition, collection: Vs.games});
                Vs.gameHistoryView.render();
            });
        },

        showCompetition: function(id) {

            //show competition view
            Vs.router._fetchCompetition(id, this.refreshCompetition);
        },
        showAllCompetitions: function() {

            var competitions = new Vs.CompetitionCollection();

            competitions.fetch({
                success: function(collection, response)  {
                    console.log(response);
                    //Vs.AllCompetitionsView.collection = collection;// = new Vs.AllCompetitionsView({collection: collection});
                    Vs.allCompetitionsView = new Vs.AllCompetitionsView({collection: competitions});
                    Vs.allCompetitionsView.render();
                },
                error: function(collection, response) {
                    console.log(response);
                }
            });
        },

        showNewGame: function(id, competitorId, competitorId2) {

            var renderGameView = function () {
                if (Vs.competition.loaded && Vs.competitors.loaded) {
                    Vs.newGameView2.model = Vs.competition;
                    Vs.newGameView2.collection = Vs.competitors;
                    Vs.newGameView2.render(competitorId, competitorId2);
                }
            };

            if (!Vs.competition || Vs.competition.get('id') !== id) {
                Vs.router._fetchCompetition(id, renderGameView);
                Vs.router._fetchCompetitors(id, renderGameView);
            } else {
                renderGameView();
            }
        },

        showNewTournamentGame: function(competitionId, tournamentId, matchId) {

            var renderGameView = function () {
                if (Vs.competition.loaded && Vs.tournament.loaded && Vs.competitors.loaded) {
                    Vs.newGameView2.model = Vs.competition;
                    Vs.newGameView2.collection = Vs.competitors;
                    Vs.newGameView2.tournament = Vs.tournament;
                    Vs.newGameView2.renderTournament(tournamentId, matchId);
                }
            };

            if (!Vs.tournament || !Vs.competitors || !Vs.competition || Vs.competition.get('id') !== competitionId) {
                Vs.router._fetchCompetition(competitionId, renderGameView);
                Vs.router._fetchTournament(competitionId, renderGameView);
                Vs.router._fetchCompetitors(competitionId, renderGameView);
            } else {
                renderGameView();
            }
        },

        showTournament: function(competitionId) {

            var renderTournamentView = function () {
                if (Vs.competition.loaded && Vs.tournament.loaded && Vs.competitors.loaded) {
                    Vs.tournamentView.model = Vs.tournament;
                    Vs.tournamentView.render();
                }
            };

            Vs.tournamentView = new Vs.TournamentView();

            if (!Vs.tournament || !Vs.competitors || !Vs.competition || Vs.competition.get('id') !== competitionId) {
                Vs.router._fetchCompetition(competitionId, renderTournamentView);
                Vs.router._fetchTournament(competitionId, renderTournamentView);
                Vs.router._fetchCompetitors(competitionId, renderTournamentView);
            } else {
                renderTournamentView();
            }
        },

		fetchTitles: function(id, callback) {
			Vs.titles = new Vs.TitleCollection();
			Vs.titles.loaded = false;

			Vs.titles.fetch({
				data: {competition_id: id},
				success: function(model, response)  {
                    Vs.titles.loaded = true;
                    callback();
                },
                error: function(model, response) {
                    console.log(response);
                }
			});
		},

        _fetchCompetition: function(id, callback) {

            Vs.competition = new Vs.Competition();
            Vs.competition.loaded = false;

            Vs.competition.fetch({
                data: { id: id},
                success: function(model, response)  {
                    Vs.competition.loaded = true;
                    callback();

                },
                error: function(model, response) {
                    console.log(response);
                }
            });
        },

        _fetchTournament: function(id, callback) {

            Vs.tournament = new Vs.Tournament();
            Vs.tournament.loaded = false;

            Vs.tournament.fetch({
                data: { id: id},
                success: function(model, response)  {
                    Vs.tournament.loaded = true;
                    callback();

                },
                error: function(model, response) {
                    console.log(response);
                }
            });
        },

        _fetchCompetitors: function(id, callback) {

            Vs.competitors = new Vs.CompetitorCollection();
            Vs.competitors.loaded = false;

            //_id needs to be set so fetch can run without data.
            Vs.competitors.fetch({
                data: { competition_id: id},
                success: function(collection, response)  {
                    Vs.competitors.loaded = true;
                    console.log(collection);
                    callback();
                },
                error: function(collection, response) {
                    console.log(response);
                }
            });
        },

        _fetchGames: function(id, callback) {

            Vs.games = new Vs.GameCollection();

            Vs.games.fetch({
                data: { competition_id: id},
                success: function(collection, response)  {
                    console.log(collection);
                    callback();
                },
                error: function(collection, response) {
                    console.log(response);
                }
            });
        }

    });

    FastClick.attach(document.body);

    //some badly placed code to prevent bootstrap modal blockers from remaining after a page naviagtion
    window.onpopstate = function() {
        $('.modal-backdrop').remove();
    };

    Vs.allCompetitionsView = new Vs.AllCompetitionsView();
    Vs.newGameView2 = new Vs.NewGameView2();
    Vs.tournamentView = new Vs.TournamentView();
    Vs.competitionGraphView = new Vs.CompetitionGraphView();
    Vs.competitorStatView = new Vs.CompetitorStatView({el:'#mainContainer'});
    // Initiate the router
    Vs.router = new Vs.Router();

    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();

});
