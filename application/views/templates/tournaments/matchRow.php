<script id="tournamentMatchTemplate" type="text/template">

    <div class="matchIdentifier">
        <span><%=identifier%></span>
    </div>
    <div class="matchMain">
        <% if (nick1) { %>
            <div class="playerLink matchPlayer" data-id=<%=rivlId1 %>>
                <img src="img/avatars/2_<%=rivlId1%>_1.png?ver=5" class="matchAvatar" />
                <span class="matchPlayerName"><%=nick1%></span>
            </div>
        <% } else { %>
            <div class="matchPlayer">
                <img src="img/avatars/anonymous.png?ver=5" class="matchAvatar" />
                <span class="matchPlayerName"><em><%=prereq1%></em></span>
            </div>
        <% } %>
        <% if (nick2) { %>
            <div class="playerLink matchPlayer" data-id=<%=rivlId2 %>>
                <img src="img/avatars/2_<%=rivlId2%>_1.png?ver=5" class="matchAvatar" />
                <span class="matchPlayerName"><%=nick2%></span>
            </div>
        <% } else { %>
            <div class="matchPlayer noPlayer">
                <img src="img/avatars/anonymous.png?ver=5" class="matchAvatar" />
                <span class="matchPlayerName"><em><%=prereq2%></em></span>
            </div>
        <% } %>
    </div>
    <div class="matchResults">
        <% if (!complete) { %>
            <a class='enterChallongeResult' data-p1=<%=rivlId1 %> data-p2=<%=rivlId2 %> data-matchid=<%=id %>>?</a>
        <% } else { %>
            <div class="matchResult matchResultP1"><% if (winner === rivlId1) { %>W<% } %></div>
            <div class="matchResult matchResultP2"><% if (winner === rivlId2) { %>W<% } %></div>
        <% } %>
    </div>
</script>