<script id="competitorRowTemplate" type="text/template">
    <%
    	var elo = Math.round(elo);
	%>

    <%
    var rankPostfix = 'moo';
    if(rank%100 > 3 && rank%100 < 21){
        rankPostfix = "th";
    } else if(rank%10 == 1) {
        rankPostfix = "st";
    } else if(rank%10 == 2) {
        rankPostfix = "nd";
    } else if(rank%10 == 3) {
        rankPostfix = "rd";
    } else {
        rankPostfix = "th";
    }

    var activeRankPostfix = 'moo';
    if (!activeRank) {
        activeRank = "";
        activeRankPostfix = "";
    } else if(activeRank%100 > 3 && activeRank%100 < 21){
        activeRankPostfix = "th";
    } else if(activeRank%10 == 1) {
        activeRankPostfix = "st";
    } else if(activeRank%10 == 2) {
        activeRankPostfix = "nd";
    } else if(activeRank%10 == 3) {
        activeRankPostfix = "rd";
    } else {
        activeRankPostfix = "th";
    }

    %>

    <div class="col-xs-3 playerPosition">
        <span class='inactiveRank'><%=rank%><%=rankPostfix%></span>
        <span class='activeRank'><%=activeRank%><%=activeRankPostfix%></span>
    </div>

    <div class="col-xs-9">
        <a class="playerLink link"><%=name%></a>
    </div>

</script>