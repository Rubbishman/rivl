Vs.CompetitorView = Backbone.View.extend({   

    initialize: function () {},

    render: function() {

        this.$el.html('');
        $el = this.$el;
        this.collection.each(this._renderRow);
        return this;
    },

    _renderRow: function(game) {
        var cr = new Vs.CompetitorRow({model: game});
        $el.append(cr.render().el);
    }
});