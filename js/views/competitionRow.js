Vs.CompetitionRow = Backbone.View.extend({

	template : _.template($('#competitionRowTemplate').html()),            
    tagName : "li",

    initialize: function () {
    },

    events : {
        "click" : "showCompetition"
    },

    render: function() {

        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    showCompetition: function() {

        Vs.router.navigate('competition/' + this.model.get('id'), true);
    }

});