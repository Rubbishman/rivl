Vs.Tournament = Backbone.Model.extend({

    urlRoot: 'vs_api/tournament',
    defaults: {},
    initialize: function(){
    },

    enterResult: function (tournament_id, match_id, winner_id, score) {
        var model = {
            tournament_id: tournament_id,
            match_id: match_id,
            score: score,
            winner_id: winner_id
        };
        $.ajax({
            type: "GET",
            url: 'vs_api/tournament/update_match',
            data: model,
            success: function () {
            }
        });
    }
});
