Vs.CompetitorSelectionRow = Backbone.View.extend({   

	template : _.template($('#competitorSelectionRowTemplate').html()),            
    tagName : "li",

    initialize: function () {},

    render: function() {
        this.el = this.template(this.model.toJSON());
        return this;
    }
});