Vs.TitleView = Backbone.View.extend({   

    initialize: function () {},

    render: function() {

        this.$el.html('');
        $el = this.$el;
        this.collection.each(this._renderRow);
        return this;
    },

    _renderRow: function(title) {
        var cr = new Vs.TitleRow({model: title});
        $el.append(cr.render().el);
    }
});