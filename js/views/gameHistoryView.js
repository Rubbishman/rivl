Vs.GameHistoryView = Backbone.View.extend({

    template : _.template($('#competitionTemplate').html()),   

    initialize: function () {
        $mainPage = $('#gameHistory');
    },

    render: function() {

        $mainPage.html('');
        this.collection.each(this._renderRow);
        return this;
    },

    _renderRow: function(game) {
        var cr = new Vs.GameRow({model: game});
        $mainPage.append(cr.render().el);
    }

});