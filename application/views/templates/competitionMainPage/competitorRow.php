<script id="competitorRowTemplate" type="text/template">
    <% 
    	var elo = Math.round(elo); 
	%>

    <%
    var rank = $('#competitors .row').length + 1;

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

    %>

    <div class="col-xs-3 playerPosition">
        <%=rank%><%=rankPostfix%>
    </div>

    <div class="col-xs-9">
        <a class="playerLink link"><%=name%></a>
    </div>
	
</script>