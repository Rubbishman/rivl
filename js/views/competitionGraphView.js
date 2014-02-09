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
        
        // view configuration (styling)
      var view = {
        width: 1024,
        height: 768,
        backgroundColor: 'white',
        tooltip : {
        	node: {
		      stroke: '#222'
		    }
        }
      };

      // line charts are instantiated with a container DOM element,
      // a model, and a view
      var lineChart = new MeteorCharts.Line({
        container: 'mainGraph',
        model: {title : this.model.attributes.title,
        		series : this.model.attributes.series},
        view: view
      });
        
		// mainGraph = $("#mainGraph").get(0).getContext("2d");
		// data = {
			// labels : this.model.attributes.labels,
			// datasets : this.model.attributes.data
		// };
        // options = {'pointDot' : false };
		// myNewChart = new Chart(mainGraph).Line(data,options);
        
        return this;
    }
});