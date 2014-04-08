Vs.AllTournamentsView = Backbone.View.extend({

    navbarTemplate : _.template($('#navbarTemplate').html()),
    rowTemplate : _.template($('#tournamentRowTemplate').html()),

    initialize: function () {
        $mainPage = $("#mainContainer");
    },

    render: function() {

        var self = this;
        $mainPage.html(this.navbarTemplate(Vs.competition.toJSON()));

        this.collection.each(function(tournament) {
            self._renderRow(self, tournament);
        });
        return this;
    },

    _renderRow: function(self, tournament) {

        $mainPage.append(self.rowTemplate(tournament.toJSON()));
    }

});