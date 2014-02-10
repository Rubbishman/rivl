<script id="playerStatRowTemplate" type="text/template">
    <% var games = Number(win_num) + Number(loss_num); %>
    <% var winPercent = Math.round(Number(win_num) / Number(games) * 100); %>
    <% var lossPercent = 100 - winPercent; %>

    <div class="row percentBarRow rivlsStatsRow">
        <div class="col-xs-5 playerStatsRowName">
            <a class="playerLink link"><%=opponent_name%></a>
        </div>
        <div class="col-xs-7 percentBar">
            <div class="bar barGood" style="width: <%=winPercent%>%">&nbsp;</div>            
            <div class="bar barBad" style="width: <%=lossPercent%>%"></div>
            <div class="barInfo"><span class="<% if (winPercent < 50) {%>bad<% } %>"><%=win_num%>/<%=games%></span></div>
        </div>

    </div>
</script>