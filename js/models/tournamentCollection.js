Vs.TournamentCollection = Backbone.Collection.extend({

    model: Vs.Tournament,
    url: 'vs_api/tournament/list_tournaments'
});