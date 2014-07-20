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
            var rankImage = $('#rankImage_'+self.model.attributes.competitor_id);
            rankImage.css({'box-shadow': "0 0 0 2px #F55"});
            $('#eloDisplay').css({'left': rankImage.css('left'), 'top': rankImage.css('top')});
            $('#eloDisplay').html(self.model.attributes.elo);
            $('#eloDisplay').show();
    	});
        $(this.el).mouseleave(function() {
            var rankImage = $('#rankImage_'+self.model.attributes.competitor_id);
            rankImage.css({'box-shadow': "0 0 0 2px #555"});
            $('#eloDisplay').html('');
            $('#eloDisplay').hide();
    	});

        return this;
    }
});