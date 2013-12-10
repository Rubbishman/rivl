<script id="competitorGameRowTemplate" type="text/template">
        <div class="row">

            <!-- old way: -->
            <!--
            <div class="col-m-3  col-xs-6">
                <a class="playerLink link"><%=vsPlayer%></a>
            </div>
            <div class="col-m-2  col-xs-3">
                <%=playerScore%>&nbsp;-&nbsp;<%=vsScore%></td>
            </div>
            -->

            <!-- clumps and no scores: -->
            <div class="col-m-4  col-xs-5">
                <a class="playerLink link"><%=vsPlayer%></a>
            </div>
            <div class="col-m-6  col-xs-4">
                 2/3 games won
            </div>

            <!-- interim solution: -->
            <!--
            <div class="col-m-5  col-xs-9">
                <a class="playerLink link"><%=vsPlayer%></a>
            </div>
-->
            <div class="col-m-2  col-xs-3">
                <% if (playerScore === '11') { %>
                    <span class="good"><span class="glyphicon glyphicon-circle-arrow-up"></span> <%= Math.abs(Math.round(playerElo*10) / 10) %></span>
                <% } else { %>
                    <span class="bad"><span class="glyphicon glyphicon-circle-arrow-down"></span> <%= Math.abs(Math.round(playerElo*10) / 10) %></span>
                <% } %>
            </div>
            <!-- what the heck? <div class="col-m-5 hidden-phone"></div>-->

        </div>
    </script>