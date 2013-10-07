
$(function () {

    //define the route and function maps for this router
    Vs.Router = Backbone.Router.extend({

        routes: {

            "competition" : "showAllCompetitions",
            "competition/:id" : "showCompetition",
            "competition/:id/game" : "showNewGame",
            "*other"    : "showAllCompetitions"
        },

        //constructor
        initialize : function () {

        },
		refreshCompetition: function() {
			Vs.competitionView = new Vs.CompetitionView({model: Vs.competition});
            Vs.competitionView.render();
            
            this._fetchCompetitors(Vs.competition.get('id'), function() {

                Vs.competitorView = new Vs.CompetitorView({el:$("#competitors"),model: Vs.competition, collection: Vs.competitors});
                Vs.competitorView.render();

                Vs.newGameView = new Vs.NewGameView({el:$('#newGame'),model: Vs.competition, collection: Vs.competitors});
                Vs.newGameView.render();
            });
            
            this._fetchGames(Vs.competition.get('id'), function() {
                Vs.gameHistoryView = new Vs.GameHistoryView({model: Vs.competition, collection: Vs.games});
                Vs.gameHistoryView.render();
            });
		},

        showCompetition: function(id) {

            //show competition view
            this._fetchCompetition(id, this.refreshCompetition);
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

        showNewGame: function(id) {

            var renderGameView = function () {
                if (Vs.competition && Vs.competitors) {
                    Vs.newGameView2 = new Vs.NewGameView2({model: Vs.competition, collection: Vs.competitors});
                    Vs.newGameView2.render();
                }
            };

            if (!Vs.competition || Vs.competition.get('id') !== id) {
                delete Vs.competition;
                delete Vs.competitors;
                this._fetchCompetition(id, renderGameView);
                this._fetchCompetitors(id, renderGameView);
            } else {
                renderGameView();
            }            
        },



        _fetchCompetition: function(id, callback) {

            Vs.competition = new Vs.Competition();

            Vs.competition.fetch({
                data: { id: id},
                success: function(model, response)  {
                    callback();

                },
                error: function(model, response) {
                    console.log(response);
                }
            });
        },

        _fetchCompetitors: function(id, callback) {

            Vs.competitors = new Vs.CompetitorCollection();
            //_id needs to be set so fetch can run without data.
            Vs.competitors.fetch({
                data: { competition_id: id},
                success: function(collection, response)  {
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
    
	Vs.allCompetitionsView = new Vs.AllCompetitionsView();

    // Initiate the router
    Vs.router = new Vs.Router();

    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();

});
