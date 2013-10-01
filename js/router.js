
$(function () {

    //define the route and function maps for this router
    Vs.Router = Backbone.Router.extend({

        routes: {

            "competition" : "showAllCompetitions",
            "competition/:id" : "showCompetition",
            "*other"    : "showAllCompetitions"
        },

        //constructor
        initialize : function () {

        },
		refreshCompetition: function() {
			Vs.competitionView = new Vs.CompetitionView({model: Vs.competition});
            Vs.competitionView.render();
            
            Vs.competitors = new Vs.CompetitorCollection();
			//_id needs to be set so fetch can run without data.
					Vs.competitors.fetch({
						data: { competition_id: Vs.competition.id},
                        success: function(collection, response)  {
                            console.log(collection);
                            Vs.competitorView = new Vs.CompetitorView({el:$("#competitors"),model: Vs.competition, collection: Vs.competitors});
                            Vs.competitorView.render();

                            Vs.newGameView = new Vs.NewGameView({el:$('#newGame'),model: Vs.competition, collection: Vs.competitors});
                            Vs.newGameView.render();
                        },
                        error: function(collection, response) {
                            console.log(response);
                        }
					});
            
            Vs.games = new Vs.GameCollection();

            Vs.games.fetch({
                data: { competition_id: Vs.competition.id},
                success: function(collection, response)  {
                    console.log(collection);  
                    Vs.gameHistoryView = new Vs.GameHistoryView({model: Vs.competition, collection: Vs.games});
                    Vs.gameHistoryView.render();
                },
                error: function(collection, response) {
                    console.log(response);
                }
            });
		},

        showCompetition: function(id) {

            //show competition view
            Vs.competition = new Vs.Competition();

            Vs.competition.fetch({
                data: { id: id},
                success: function(model, response)  {

					Vs.router.refreshCompetition();

                },
                error: function(model, response) {
                    console.log(response);
                }
            });
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
        }

    });
    
	Vs.allCompetitionsView = new Vs.AllCompetitionsView();

    // Initiate the router
    Vs.router = new Vs.Router();

    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();

});
