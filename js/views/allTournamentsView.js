Vs.AllTournamentsView = Backbone.View.extend({

    navbarTemplate : _.template($('#navbarTemplate').html()),
    allTournamentsTemplate : _.template($('#allTournamentsTemplate').html()),
    rowTemplate : _.template($('#tournamentRowTemplate').html()),
    el : '#mainContainer',

    events : {
        'click .tournamentLink': 'clickedTournament'
    },

    initialize: function () {
    },

    clickedTournament: function(e) {
        var competitionId = $(e.target).data('competitionid'),
            challongeId = $(e.target).data('challongeid');

        if (competitionId && challongeId) {
            Vs.router.navigate('competition/' + competitionId + "/tournament/" + challongeId, true);
        }
    },

    render: function() {

        var self = this;
        $(this.el).html(this.navbarTemplate(Vs.competition.toJSON()));
        $(this.el).append(this.allTournamentsTemplate());

        this.collection.each(function(tournament) {
            self._renderRow(self, tournament);
        });
        return this;
    },

    _renderRow: function(self, tournament) {

        $("#tournaments").append(self.rowTemplate(tournament.toJSON()));
    }

});