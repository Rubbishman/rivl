Vs.CompetitionView = Backbone.View.extend({

    template : _.template($('#competitionTemplate').html()),  
    navbarTemplate : _.template($('#navbarTemplate').html()),   

    initialize: function () {
        $mainPage = $("#mainContainer");
    },

    render: function() {

        $mainPage.html(this.navbarTemplate(this.model.toJSON()));
        $mainPage.append(this.template(this.model.toJSON()));
        return this;
    }
});