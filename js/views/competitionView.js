Vs.CompetitionView = Backbone.View.extend({

    template : _.template($('#competitionTemplate').html()),   

    initialize: function () {
        $mainPage = $("#mainContainer");
    },

    render: function() {

        $mainPage.html(this.template(this.model.toJSON()));
        return this;
    }
});