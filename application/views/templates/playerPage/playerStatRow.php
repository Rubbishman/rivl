<script id="playerStatRowTemplate" type="text/template">
    <% var games = Number(win_num) + Number(loss_num); %>
    <% var winPercent = Math.round(Number(win_num) / Number(games) * 100); %>
    <% var lossPercent = 100 - winPercent; %>

    <div class="row percentBarRow rivlsStatsRow">
        <div class="col-xs-4">
            <a class="playerLink link"><%=opponent_name%></a>
        </div>
        <div class="col-xs-5 percentBar">
            <div class="bar barGood" style="width: <%=winPercent%>%"><strong><span><%=win_num%>(<%=win_streak%>)</span></strong></div>            
            <div class="bar barBad" style="width: <%=lossPercent%>%"><span><%=loss_num%>(<%=loss_streak%>)</span></div>
            <div class="barInfo"><span class="<% if (winPercent < 50) {%>bad<% } %>"><%=winPercent%>%</span></div>
        </div>
        <div class="col-xs-3">
            <div class="fl playedMeterWrap">
                <div class="fl gamesPlayedLabel">
                    <%=games%> <small>games</small>
                </div>
                <div class="playerGamesBar" style="width:<%=gamePercent%>%;"></div>
            </div>
        </div>
    </div>
</script>