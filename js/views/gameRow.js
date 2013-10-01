Vs.GameRow = Backbone.View.extend({

	template : _.template($('#gameRowTemplate').html()),            
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