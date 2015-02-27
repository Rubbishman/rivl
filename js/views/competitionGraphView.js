Vs.CompetitionGraphView = Backbone.View.extend({

    template : _.template($('#competitionGraphTemplate').html()),
    navbarTemplate : _.template($('#navbarTemplate').html()),

    initialize: function () {
        $mainPage = $("#mainContainer");
    },

    render: function() {
    	var self = this;
        this.model.attributes.name = this.competition.attributes.name;
    	
        $("#mainContainer").html(this.navbarTemplate(this.competition.toJSON()));
        $("#mainContainer").append(this.template(this.model.toJSON()));

        nv.addGraph(function() {
            var chart = nv.models.lineWithFocusChart()//lineChart()
                .margin({right: 100})
                .interpolate("basis")
                .x(function(d) { return d[0] })   //We can modify the data accessor functions...
                .y(function(d) { return d[1] });   //...in case your data is formatted differently.
//                .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
//                .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
//                .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
//                .clipEdge(true);

            //Format x-axis labels with custom function.
            chart.xAxis
                .tickFormat(function(d) {
                    return d3.time.format('%x')(new Date(d*1000))
                });

            chart.yAxis
                .tickFormat(d3.format(','));

            chart.x2Axis
                .tickFormat(function(d) {
                    return d3.time.format('%x')(new Date(d*1000))
                });

            chart.y2Axis
                .tickFormat(d3.format(','));

            d3.select('#mainGraph')
                .datum(self.model.attributes.graphData)
                .transition().duration(500)
                .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        });
        
        return this;
    }
});