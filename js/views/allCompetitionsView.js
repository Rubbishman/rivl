Vs.AllCompetitionsView = Backbone.View.extend({

    rowTemplate : _.template($('#competitionRowTemplate').html()),            
    
    initialize: function () {
        $mainPage = $("#mainContainer");
    },

    render: function() {

        $mainPage.html('');

        this.collection.each(this._renderRow);
        return this;
    },

    _renderRow: function(competition) {
        var cr = new Vs.CompetitionRow({model: competition});
        $mainPage.append(cr.render().el);
    }

});