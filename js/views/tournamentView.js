Vs.TournamentView = Backbone.View.extend({

    tournamentTemplate : _.template($('#tournamentTemplate').html()),
    competitorTemplate : _.template($('#tournamentCompetitorTemplate').html(), undefined, { variable: 'data' }),
    matchTemplate : _.template($('#tournamentMatchTemplate').html()) ,
    gridTemplate : _.template($('#tournamentMatchGridTemplate').html()) ,
    navbarTemplate : _.template($('#navbarTemplate').html()),
    el : '#mainContainer',

    events : {
        'click .playerLink': 'clickedCompetitor',
        'click .enterChallongeResult': 'clickedEnterResult',
        'mouseenter .matchPlayer': 'hoverMatchPlayer',
        'mouseleave .matchPlayer': 'unhoverMatchPlayer'
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

    hoverMatchPlayer: function(e) {

        var id = $(e.target).data('id');
        $('.matchPlayer[data-id="' + id + '"]').addClass('playerHover');

    },

    unhoverMatchPlayer: function(e) {

        $('.matchPlayer').removeClass('playerHover');

    },

    render: function() {
        $(this.el).html(this.navbarTemplate(Vs.competition.toJSON()));
    },

    renderTournament: function() {

        $(this.el).append(this.tournamentTemplate(this.model.toJSON()));

        var self = this,
            participants = this.model.get('participants').participant,
            matches = this.model.get('matches').match,
            winnersMatrix = {},
            losersMatrix = {},
            round,
            totalRounds = 0,
            simultaneousWinnerMatches = 0,
            simultaneousLoserMatches = 0;

        var participantsMap = this.generateParticipantsMap(participants);
        var matchesMap = this.generateMatchesMap(matches);

        _.each(matches, function(match) {

            match = self.populateMatchData(match, participantsMap, matchesMap);

            round = match.round;
            if (round > 0) {
                winnersMatrix[round] = winnersMatrix[round] || new Array();
                winnersMatrix[round].push(match);
            } else {
                round = round * -1;
                losersMatrix[round] = losersMatrix[round] || new Array();
                losersMatrix[round].push(match);
            }
            totalRounds = Math.max(totalRounds, round);
        });

        //remove last round of winners bracket (2nd game)
        winnersMatrix[totalRounds].pop();

        for (var i = 1; i <= totalRounds; i++) {
            simultaneousWinnerMatches = Math.max(simultaneousWinnerMatches, winnersMatrix[i].length);
            simultaneousLoserMatches = Math.max(simultaneousLoserMatches, losersMatrix[i].length);
        }

        var $table = $table = $('<table class="tournamentTable"></table>');
        var $row = $('<tr style="border-bottom: 1px solid;"></tr>');

        $row = this.renderBracket($row, winnersMatrix, simultaneousWinnerMatches, totalRounds, self);
        $table.append($row);

        $row = $('<tr></tr>');
        $row = this.renderBracket($row, losersMatrix, simultaneousLoserMatches, totalRounds, self);
        $table.append($row);

        $(this.el).append($table);

        return this;
    },

    generateParticipantsMap: function(participants) {

        var participantsMap = {};
        _.each(participants, function(item) {
            var rivlUser = Vs.competitors.where({challonge_username: item['challonge-username']});
            if (rivlUser.length > 0) {
                participantsMap[item['id']] = rivlUser[0].attributes;
                participantsMap[item['id']].nick = rivlUser[0].get('pseudonym') || rivlUser[0].get('name');
            } else {
                participantsMap[item['id']] = {};
                participantsMap[item['id']].nick = item['name'];
            }
        });
        return participantsMap;
    },

    generateMatchesMap: function(matches) {

        var matchesMap = {};
        _.each(matches, function(item) {
            matchesMap[item.id] = item;
        });
        return matchesMap;
    },

    populateMatchData: function(match, participantsMap, matchesMap) {

        match.rivlId1 = participantsMap[match['player1-id']] && participantsMap[match['player1-id']].competitor_id
            ? participantsMap[match['player1-id']].competitor_id
            : '0';
        match.rivlId2 = participantsMap[match['player2-id']] && participantsMap[match['player2-id']].competitor_id
            ? participantsMap[match['player2-id']].competitor_id
            : '0';
        match.nick1 = typeof(match['player1-id']) === 'string'
            ? participantsMap[match['player1-id']].nick
            : '';
        match.nick2 = typeof(match['player2-id']) === 'string'
            ? participantsMap[match['player2-id']].nick
            : '';
        match.prereq1 = typeof(match['player1-id']) !== 'string'
            ? (match['player1-is-prereq-match-loser'] === 'true' ? 'loser' : 'winner') + ' of ' + matchesMap[match['player1-prereq-match-id']].identifier
            : '';
        match.prereq2 = typeof(match['player2-id']) !== 'string'
            ? (match['player2-is-prereq-match-loser'] === 'true' ? 'loser' : 'winner') + ' of ' + matchesMap[match['player2-prereq-match-id']].identifier
            : '';
        match.winner = typeof(match['winner-id']) === 'string'
            ? participantsMap[match['winner-id']].competitor_id
            : false;
        match.complete = match['state'] === 'complete'
            ? true
            : false;

        return match;
    },

    renderBracket: function($row, matrix, simultaneousMatches, totalRounds, self) {

        var curMatch,
            cellHeight = 60,
            paddingHeight = 60 / 6,
            j;

        for (j = 1; j <= totalRounds; j++) {

            var $cell = $('<td></td>'),
                count = 0,
                parity = 0;

            _.each(matrix[j], function(curMatch) {

                var gridPosLeft = 'none',
                    gridPosRight = 'none',
                    matchDiff = (simultaneousMatches / matrix[j].length),
                    spacerMultiplier = 0,
                    spacerHeight = 0,
                    spacerClass = '';

                while (matchDiff !== 1 && matchDiff >= 1) {
                    matchDiff = matchDiff / 2;
                    spacerMultiplier++;
                }
                spacerHeight = (cellHeight * (spacerMultiplier - 0.5)) + (paddingHeight * (spacerMultiplier * spacerMultiplier));

                if (matrix[j].length < simultaneousMatches) {
                    $cell.append('<div class="matchSpacer ' + self.getSpacerClass(parity) + '" style="height:' + spacerHeight + 'px;"></div>');
                }
                if (curMatch) {
                    gridPosLeft = j === 1 ? 'none' : 'horizontal';
                    gridPosRight = j === totalRounds ? 'none'
                        : matrix[j].length === 1 ? 'horizontal'
                        : matrix[j + 1] && matrix[j].length === matrix[j + 1].length ? 'horizontal'
                        : (count % 2) === 0 ? 'down'
                        : 'up';

                    $cell.append('<div class="matchPadding ' + self.getSpacerClass(parity) + '" style="height:' + (paddingHeight) + 'px;"></div>');

                    var $div = $('<div class="match" style="height:' + cellHeight + 'px;"></div>')
                    $div.append(self.gridTemplate({gridPos: gridPosLeft, identifier: curMatch.identifier}));
                    $div.append(self.matchTemplate(curMatch));
                    $div.append(self.gridTemplate({gridPos: gridPosRight, identifier: curMatch.identifier}));
                    $cell.append($div);

                    parity = gridPosRight === 'down' ? 1 : 0;

                    $cell.append('<div class="matchPadding ' + self.getSpacerClass(parity) + '" style="height:' + (paddingHeight) + 'px;"></div>');
                }
                if (matrix[j].length < simultaneousMatches) {
                    $cell.append('<div class="matchSpacer ' + self.getSpacerClass(parity) + '" style="height:' + spacerHeight + 'px;"></div>');
                }
                count++;
            });
            $row.append($cell);
        }
        return $row;
    },

    getSpacerClass: function(parity) {
        return parity === 0 ? '' : 'gridLine matchSpacerVert';
    }
});
