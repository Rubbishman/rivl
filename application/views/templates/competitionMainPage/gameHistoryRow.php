<script id="gameRowTemplate" type="text/template">
        <% var game1_elo_change = Math.round(game1.elo_change * 10 ) / 10; %>
        <% var game2_elo_change = Math.abs(Math.round(game2.elo_change * 10 ) / 10); %>
        <div class="row">
            <!--        <%=game1.game_id%>-->
            <div class="col-xs-5">
                <strong><%=game1.name%></strong> vs <%=game2.name%>
            </div>
            <div class="col-xs-3">
                <strong><%=game1.score%></strong> - <%=game2.score%>
            </div>
            <div class="col-xs-2">
                <span class="good"><span class="glyphicon glyphicon-circle-arrow-up"></span> <%= game1_elo_change %></span>
            </div>
            <div class="col-xs-2">
                <span class="bad"><span class="glyphicon glyphicon-circle-arrow-down"></span> <%= game2_elo_change %></span>
            </div>
        </div>
    </script>