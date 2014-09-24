Vs.CompetitorView = Backbone.View.extend({

    initialize: function () {},

    render: function() {

        this.$el.html('');
        $el = this.$el;
        this.collection.each(this._renderRow);

        this.drawLeaderArea();

        return this;
    },

    _renderRow: function(game) {
        var cr = new Vs.CompetitorRow({model: game});
        $el.append(cr.render().el);
    },

    drawLeaderArea: function(drawInactive) {
        var holder = $('#leaderCanvasHolder'),
            lastXY = [],
            baseX = 50,
            unit = 32;

        holder.html("");
        drawInactive = drawInactive || false;
        $.each(Vs.competitors.models, function(index, competitor) {

            if (!drawInactive && !competitor.get('activeRank')) return true;
            var image = $('#hiddenImage_'+competitor.attributes.competitor_id)[0],
                thisHeight = (holder.height()-32) - ((holder.height()-32) * (competitor.attributes.elo_percent/100)),
                thisX = baseX;
            if(lastXY.length != 0) {
                var foundX = -1;
                $.each(lastXY, function(index, height) {
                    if(foundX == -1 && thisHeight - height >= unit) {
                        foundX = index * unit + 50;
                    }
                });
                if(foundX == -1) {
                    foundX = lastXY.length * unit + 50;
                }
                thisX = foundX;
            }
            if(lastXY[(thisX-50)/unit] == undefined) {lastXY[(thisX-50)/unit] = []};
            lastXY[(thisX-50)/unit] = thisHeight;

            var rankImage = $('<img src="img/avatars/2_' +
                competitor.attributes.competitor_id +
                '_1.png?ver=10" id="rankImage_' +
                competitor.attributes.competitor_id +
                '" class="leaderboardAvatar" style="left:' + thisX + 'px; top:' + thisHeight + 'px;">');
            holder.append(rankImage);
            var eloDisplay = $('<div class="eloDisplay"></div>');

            rankImage.mouseenter(function() {
                eloDisplay.css({
                    'left': thisX + 45,
                    'top': thisHeight + 2
                });
                eloDisplay.html(competitor.attributes.elo);
                eloDisplay.show();
            });
            rankImage.mouseleave(function() {
                eloDisplay.html('');
                eloDisplay.hide();
            });
            holder.append(eloDisplay);
        });
    }
});