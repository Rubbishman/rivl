<script id="newScoreTemplate" type="text/template">
		<% var game_num = $('#scoresSection').children().length + 1%>
        <div class="scoreRow row">
            <div class="col-xs-5 text-center">
                <button type="button" style="position: absolute;left:0px" class="player1Btn btn btn-default btn-block">Winner</button>
                <select class="scoreP1 hidden" style="position: absolute; margin-top: 2px; margin-left: 50px; width: 100px;">
                    <% for (var i = points-1; i >= 0; i--) { %>
                        <option value='<%= i %>'><%= i %></option>
                    <% } %>
        		</select>
            </div>
            <div class="col-xs-2 text-center gameNumber">Game <%=game_num%></div>
            <div class="col-xs-5 text-center">
                <button type="button" class="player2Btn btn btn-default btn-block">Winner</button>
                <select class="scoreP2 hidden" style="position: absolute; margin-top: 2px; margin-left: 52px; width: 100px;">
                    <% for (var i = points-1; i >= 0; i--) { %>
                        <option value='<%= i %>'><%= i %></option>
                    <% } %>
        		</select>
            </div>
        </div>
    </script>
    
    