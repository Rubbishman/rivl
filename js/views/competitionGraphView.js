Vs.CompetitionGraphView = Backbone.View.extend({

    template : _.template($('#competitionGraphTemplate').html()),
    navbarTemplate : _.template($('#navbarTemplate').html()),

    initialize: function () {
        $mainPage = $("#mainContainer");
    },

    render: function() {
    	this.model.attributes.name = this.competition.attributes.name;
    	
        $("#mainContainer").html(this.navbarTemplate(this.competition.toJSON()));
        $("#mainContainer").append(this.template(this.model.toJSON()));
        
		mainGraph = $("#mainGraph").get(0).getContext("2d");
		data = {
			labels : this.model.attributes.labels,
			datasets : this.model.attributes.data
		};
        options = {'pointDot' : false };
		myNewChart = new Chart(mainGraph).Line(data,options);
        
        return this;
    }
});