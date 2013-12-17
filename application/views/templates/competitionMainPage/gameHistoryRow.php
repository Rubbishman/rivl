<script id="gameRowTemplate" type="text/template">
        <% var game1_elo_change = Math.round(p1.elo_change * 10 ) / 10; %>
        <% var game2_elo_change = Math.abs(Math.round(p2.elo_change * 10 ) / 10); %>
        <div class="row">
            <!-- interim way: no scores or clumping: -->
            <div class="col-xs-8">
                <strong class="player1Link"><a><%=p1.name%></a></strong> vs <a class="player2Link"><%=p2.name%></a>
            </div>


            <div class="col-xs-2">
                <span class="good"><span class="glyphicon glyphicon-circle-arrow-up"></span> <%= game1_elo_change %></span>
            </div>
            <div class="col-xs-2">
                <span class="bad"><span class="glyphicon glyphicon-circle-arrow-down"></span> <%= game2_elo_change %></span>
            </div>
        </div>
    </script>
    
<script id="gameRowShortFormTemplate" type="text/template">
        <% var p1_elo_change = Math.round(p1.elo_change * 10 ) / 10; %>
        <% var p2_elo_change = Math.abs(Math.round(p2.elo_change * 10 ) / 10); %>
        <div class="row">

            <!-- new way when we support clumping and no scores: -->
           <div class="col-xs-4">
                <strong class="player1Link link"><a><%=p1.name%></a></strong> vs <a class="player2Link"><%=p2.name%></a>
            </div>
            <div class="col-xs-3">
                <%=p1.wins%> games to <%=p2.wins%>
            </div>

            <div class="col-xs-2">
            	<% if(p1.elo_change > 0) { %>
            		<span class="good"><span class="glyphicon glyphicon-circle-arrow-up"></span> <%= p1_elo_change %></span>
            	<% } else { %>
            		<span class="bad"><span class="glyphicon glyphicon-circle-arrow-down"></span> <%= p1_elo_change %></span>
            	<% } %>
            </div>
            <div class="col-xs-2">
                <% if(p2.elo_change > 0) { %>
            		<span class="good"><span class="glyphicon glyphicon-circle-arrow-up"></span> <%= p2_elo_change %></span>
            	<% } else { %>
            		<span class="bad"><span class="glyphicon glyphicon-circle-arrow-down"></span> <%= p2_elo_change %></span>
            	<% } %>
            </div>
        </div>
    </script>