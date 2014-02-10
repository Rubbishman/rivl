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

        <div class="col-xs-2 playerPosition">
            <%=rank%><%=rankPostfix%>
        </div>
        <div class="col-xs-4">
            <a class="playerLink link"><%=name%></a>
        </div>
    	<div class="col-xs-6 playedMeterWrapParent">
            <div class="fl playedMeterWrap">
                <div class="playerGamesBar" style="width:<%=elo_percent%>%;">
                	<div class="fl gamesPlayedLabel pointsDisplay" style="display: none;">
                        <%=elo%>
                    </div>
                </div>
                
            </div>
        </div>
    </script>