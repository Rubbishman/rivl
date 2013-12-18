<script id="newScoreTemplate" type="text/template">
	<% var game_num = $('#scoresSection').children().length + 1%>
    <div class="scoreRow row">
        <div class="col-xs-5 text-center">
            <div class="btnGroupWrap">
                <button type="button" class="player1Btn btn btn-default btn-block">
                    Winner?
                </button>
                <ul class="dropdown-menu" role="menu">
                    <% for (var i = points-1; i >= 0; i--) { %>
                        <li><a href="javascript:void(0);" data-score="<%= i %>"><%= i %> points</a></li>
                    <% } %>
                </ul>
            </div>   
        </div>
        
        <div class="col-xs-2 text-center gameNumber">Game <%=game_num%></div>
        
        <div class="col-xs-5 text-center">
            <div class="btnGroupWrap">
                <button type="button" class="player2Btn btn btn-default btn-block">
                    Winner?
                </button>
                <ul class="dropdown-menu" role="menu">
                    <% for (var i = points-1; i >= 0; i--) { %>
                        <li><a href="javascript:void(0);" data-score="<%= i %>"><%= i %> points</a></li>
                    <% } %>
                </ul>
            </div>
        </div>
    </div>
</script>

