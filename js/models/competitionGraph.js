Vs.CompetitionGraph = Backbone.Model.extend({
	
    urlRoot: 'vs_api/competitor_graph/get_all_graphs',
    defaults: {
        name: ''
    },
    initialize: function(){
    }
});
