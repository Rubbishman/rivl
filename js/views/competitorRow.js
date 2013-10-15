Vs.CompetitorRow = Backbone.View.extend({

	template : _.template($('#competitorRowTemplate').html()),            
    tagName : "tr",

    initialize: function () {
    },

    events : {
    	'click': 'clickedCompetitor'
    },
    clickedCompetitor: function() {
    	Vs.router.navigate('competition/' + Vs.competition.get('id') + "/competitor_home/" + this.model.get('competitor_id'), true);
    },
    render: function() {

        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});