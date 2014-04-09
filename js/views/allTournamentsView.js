Vs.AllTournamentsView = Backbone.View.extend({

    navbarTemplate : _.template($('#navbarTemplate').html()),
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

        this.collection.each(function(tournament) {
            self._renderRow(self, tournament);
        });
        return this;
    },

    _renderRow: function(self, tournament) {

        $(self.el).append(self.rowTemplate(tournament.toJSON()));
    }

});