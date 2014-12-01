<script id="playerStatRowTemplate" type="text/template">
    <% var games = Number(win_num) + Number(loss_num); %>
    <% var winPercent = Math.round(Number(win_num) / Number(games) * 100); %>
    <% var lossPercent = 100 - winPercent; %>
    <% var recentGames = Number(recent_win_num) + Number(recent_loss_num); %>
    <% var recentWinPercent = Math.round(Number(recent_win_num) /  Number(recentGames) * 100); %>
    <% var recentLossPercent = 100 - recentWinPercent; %>

    <div class="row percentBarRow rivlsStatsRow">
        <div class="col-xs-2 playerStatsRowName">
            <a class="playerLink link"><%=opponent_name%></a>
        </div>
        <div class="col-xs-5 percentBar">
            <div class="bar barGood" style="width: <%=winPercent%>%">&nbsp;</div>
            <div class="bar barBad" style="width: <%=lossPercent%>%"></div>
            <div class="barInfo"><span class="<% if (winPercent < 50) {%>bad<% } %>"><%=win_num%>/<%=games%></span></div>
        </div>
        <div class="col-xs-5 percentBar">
            <div class="bar barGood" style="width: <%=recentWinPercent%>%">&nbsp;</div>
            <div class="bar barBad" style="width: <%=recentLossPercent%>%"></div>
            <div class="barInfo"><span class="<% if (recentWinPercent < 50) {%>bad<% } %>"><%=recent_win_num%>/<%=recentGames%></span></div>
        </div>

    </div>
</script>