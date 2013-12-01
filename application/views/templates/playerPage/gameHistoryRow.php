<script id="competitorGameRowTemplate" type="text/template">
        <div class="row">
            <div class="col-m-3  col-xs-6">
                <a class="playerLink link"><%=vsPlayer%></a>
            </div>
            <div class="col-m-2  col-xs-3">
                <%=playerScore%>&nbsp;-&nbsp;<%=vsScore%></td>
            </div>
            <div class="col-m-2  col-xs-3">
                <% if (playerScore === '11') { %>
                    <span class="good"><span class="glyphicon glyphicon-circle-arrow-up"></span> <%= Math.abs(Math.round(playerElo*10) / 10) %></span>
                <% } else { %>
                    <span class="bad"><span class="glyphicon glyphicon-circle-arrow-down"></span> <%= Math.abs(Math.round(playerElo*10) / 10) %></span>
                <% } %>
            </div>
            <div class="col-m-5 hidden-phone"></div>

        </div>
    </script>