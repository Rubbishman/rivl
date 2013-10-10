Vs.CompetitorRow = Backbone.View.extend({

	template : _.template($('#competitorRowTemplate').html()),            
    tagName : "tr",

    initialize: function () {
    },

    events : {
    },
    render: function() {

        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});