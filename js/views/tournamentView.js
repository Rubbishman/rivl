Vs.TournamentView = Backbone.View.extend({

    tournamentTemplate : _.template($('#tournamentTemplate').html()),
    competitorTemplate : _.template($('#tournamentCompetitorTemplate').html(), undefined, { variable: 'data' }),
    matchTemplate : _.template($('#tournamentMatchTemplate').html()) ,
    navbarTemplate : _.template($('#navbarTemplate').html()),
    el : '#mainContainer',

    events : {
        'click .playerLink': 'clickedCompetitor',
        'click .enterChallongeResult': 'clickedEnterResult'
    },

    initialize: function () {
    },

    clickedCompetitor: function(e) {
        var id = $(e.target).data('id');
        if (id) {
            Vs.router.navigate('competition/' + Vs.competition.get('id') + "/competitor_home/" + id, true);
        }
    },

    clickedEnterResult: function(e) {
        var p1Id = $(e.target).data('p1'),
            p2Id = $(e.target).data('p2'),
            matchId = $(e.target).data('matchid');
        if (p1Id && p2Id) {
            Vs.router.navigate('competition/' + Vs.competition.get('id') + "/tournament/game/" + Vs.tournament.get('id') + "/" + matchId, true);
        }
    },

    renderTournamentList: function() {
        $(this.el).html(this.navbarTemplate(Vs.competition.toJSON()));
        $(this.el).append('<h2><a href="#competition/' + Vs.competition.get('id') + '/tournament/767883">Arcade Action</a></h2>');
        $(this.el).append('<h2><a href="#competition/' + Vs.competition.get('id') + '/tournament/832842">The Arcade Strikes Back</a></h2>');
        $(this.el).append('<h2><a href="#competition/' + Vs.competition.get('id') + '/tournament/894159">Return of the Arcade</a></h2>');
    },

    render: function() {

        var self = this,
            participants = this.model.get('participants').participant,
            matches = this.model.get('matches').match,
            matchesMap = {},
            participantsMap = {};


        $(this.el).html(this.navbarTemplate(Vs.competition.toJSON()));
        $(this.el).append(this.tournamentTemplate(this.model.toJSON()));

        _.each(participants, function(item) {
            var rivlUser = Vs.competitors.where({challonge_username: item['challonge-username']});
            rivlUser.length > 0
                ? participantsMap[item['id']] = rivlUser[0].attributes
                : participantsMap[item['id']] = {};
            participantsMap[item['id']].nick = item['name'];
            //$(this.el).append(self.competitorTemplate(item));
        });

        var winnersMatrix = {},
            losersMatrix = {},
            round,
            totalRounds = 0,
            simultaneousMatches = 0,
            curMatch,
            cellHeight = 50,
            j;

        _.each(matches, function(item) {
            matchesMap[item.id] = item;
            round = item.round;
            if (round > 0) {
                winnersMatrix[round] = winnersMatrix[round] || new Array();
                winnersMatrix[round].push(item);
            } else {
                round = round * -1;
                losersMatrix[round] = losersMatrix[round] || new Array();
                losersMatrix[round].push(item);
            }
            totalRounds = Math.max(totalRounds, round);
        });

        //remove last round of winners bracket (2nd game)
        winnersMatrix[totalRounds].pop();

        simultaneousMatches = winnersMatrix[1].length;

        var $table = $table = $('<table></table>');
        var $row = $('<tr style="border-bottom: 1px solid;"></tr>');
        for (j = 1; j <= totalRounds; j++) {

            var $cell = $('<td></td>');
            _.each(winnersMatrix[j], function(curMatch) {

                if (winnersMatrix[j].length < simultaneousMatches) {
                    var diff = (simultaneousMatches - winnersMatrix[j].length) / 2 / 2;
                    $cell.append('<div class=matchSpacer style="width:150px; height:' + (cellHeight * diff) + 'px; margin:10px;"></div>');
                }
                if (curMatch) {
                    curMatch = self.prepareMatchObj(curMatch, participantsMap, matchesMap);
                    $cell.append('<div class=match style="width:150px; height:' + cellHeight + 'px; margin:10px;">' + self.matchTemplate(curMatch) + '</div>');
                }
                if (winnersMatrix[j].length < simultaneousMatches) {
                    var diff = (simultaneousMatches - winnersMatrix[j].length) / 2 / 2;
                    $cell.append('<div class=matchSpacer style="width:150px; height:' + (cellHeight * diff) + 'px; margin:10px;"></div>');
                }
            });
            $row.append($cell);
        }
        $table.append($row);

        var $row = $('<tr></tr>');
        for (j = 1; j <= totalRounds; j++) {

            var $cell = $('<td></td>');
            _.each(losersMatrix[j], function(curMatch) {

                if (losersMatrix[j].length < simultaneousMatches) {
                    var diff = (simultaneousMatches - losersMatrix[j].length) / 2 / 2;
                    $cell.append('<div class=matchSpacer style="width:150px; height:' + (cellHeight * diff) + 'px; margin:10px;"></div>');
                }
                if (curMatch) {
                    curMatch = self.prepareMatchObj(curMatch, participantsMap, matchesMap);
                    $cell.append('<div class=match style="width:150px; height:' + cellHeight + 'px; margin:10px;">' + self.matchTemplate(curMatch) + '</div>');
                }
                if (losersMatrix[j].length < simultaneousMatches) {
                    var diff = (simultaneousMatches - losersMatrix[j].length) / 2 / 2;
                    $cell.append('<div class=matchSpacer style="width:150px; height:' + (cellHeight * diff) + 'px; margin:10px;"></div>');
                }
            });
            $row.append($cell);
        }
        $table.append($row);
        $(this.el).append($table);

        return this;
    },

    prepareMatchObj : function(match, participantsMap, matchesMap) {
        //match.player1 = participantsMap[match['player1-id']];
        //match.player2 = participantsMap[match['player2-id']];
        match.rivlId1 = participantsMap[match['player1-id']]
            ? participantsMap[match['player1-id']].competitor_id
            : '';
        match.rivlId2 = participantsMap[match['player2-id']]
            ? participantsMap[match['player2-id']].competitor_id
            : '';
        match.nick1 = typeof(match['player1-id']) === 'string'
            ? participantsMap[match['player1-id']].nick
            : '';
        match.nick2 = typeof(match['player2-id']) === 'string'
            ? participantsMap[match['player2-id']].nick
            : '';
        match.prereq1 = typeof(match['player1-id']) !== 'string'
            ? (match['player1-is-prereq-match-loser'] === 'true' ? 'loser' : 'winner') + ' of round ' + matchesMap[match['player1-prereq-match-id']].identifier
            : '';
        match.prereq2 = typeof(match['player2-id']) !== 'string'
            ? (match['player2-is-prereq-match-loser'] === 'true' ? 'loser' : 'winner') + ' of round ' + matchesMap[match['player2-prereq-match-id']].identifier
            : '';
        match.winner = typeof(match['winner-id']) === 'string'
            ? participantsMap[match['winner-id']].competitor_id
            : false;
        match.complete = match['state'] === 'complete'
            ? true
            : false;

        return match;
    }
});
