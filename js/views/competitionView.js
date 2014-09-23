Vs.CompetitionView = Backbone.View.extend({

    template : _.template($('#competitionTemplate').html()),
    navbarTemplate : _.template($('#navbarTemplate').html()),

    initialize: function () {
        $mainPage = $("#mainContainer");
    },

    render: function() {

        var self = this;

        $mainPage.html(this.navbarTemplate(this.model.toJSON()));
        $mainPage.append(this.template(this.model.toJSON()));

        $('#addPlayer').click(function() {
            $('#addPlayer').hide();
            $('#addPlayerDiv').removeClass('hidden');
        });

        $('#showInactive').click(function() {
            $('.inactivePlayer').show();
            $('.inactiveRank').show();
            $('.activeRank').hide();
            Vs.competitorView.drawLeaderArea(true);
        });

        $('#addPlayerButton').click(this.addPlayer);

        return this;
    },
    addPlayer: function() {
        Vs.addPlayer = new Vs.AddPlayer();
        if($('#addPlayerName').val() == null || $('#addPlayerName').val().trim() == '') {
            return;
        }
        Vs.addPlayer.fetch({
            data: {name: $('#addPlayerName').val(), competition_id: Vs.competition.get('id')},
            success: function(model, response) {
                location.reload();
            },
            error: function(model, response) {
                console.log(response);
            }});
    }
});