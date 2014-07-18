Vs.CompetitorRow = Backbone.View.extend({

	template : _.template($('#competitorRowTemplate').html()),            
    tagName : "div",
    className: "row percentBarRow",

    initialize: function () {
    },

    events : {
    	'click .playerLink': 'clickedCompetitor'
    },
    clickedCompetitor: function() {
    	Vs.router.navigate('competition/' + Vs.competition.get('id') + "/competitor_home/" + this.model.get('competitor_id'), true);
    },
    render: function() {

        $(this.el).html(this.template(this.model.toJSON()));
        
        var self = this;
        $(this.el).mouseenter(function() {
            $('#hoveredCompetitor').val(self.model.attributes.competitor_id);
            Vs.router.drawLeaderCanvas();
    		self.$el.find('.pointsDisplay').show();
    	});
        $(this.el).mouseleave(function() {
            $('#hoveredCompetitor').val(-1);
            Vs.router.drawLeaderCanvas();
    		self.$el.find('.pointsDisplay').hide();
    	});
        return this;
    }

});