<script id="newResultsTemplate" type="text/template">

        <div class="resultsRow span12">
            <div class="col-xs-5 text-center">
                <% if (p1eloDelta > 0) { %>
                    <span class="resultsP1 rankUp"><span class="glyphicon glyphicon-circle-arrow-up"></span> <%= p1eloDelta %></span>
                <% } else if (p1eloDelta < 0) { %>
                    <span class="resultsP1 rankDown"><span class="glyphicon glyphicon-circle-arrow-down"></span> <%= Math.abs(p1eloDelta) %></span>
                <% } %>
            </div>
            <div class="col-xs-2"></div>
            <div class="col-xs-5 text-center">
                <% if (p2eloDelta > 0) { %>
                    <span class="resultsP2 rankUp"><span class="glyphicon glyphicon-circle-arrow-up"></span> <%= p2eloDelta %></span>
                <% } else if (p2eloDelta < 0) { %>
                    <span class="resultsP2 rankDown"><span class="glyphicon glyphicon-circle-arrow-down"></span> <%= Math.abs(p2eloDelta) %></span>
                <% } %>
            </div>
        </div>
        <div class="resultsRow span12">
            <div class="col-xs-5 text-center">
                <span class="resultsP1">
                    <% if (p1rankDelta > 0) { %>Rank up: +<%= p1rankDelta %><% } else if (p1rankDelta < 0) { %>Rank down: <%= p1rankDelta %><% } %>
                </span>
            </div>
            <div class="col-xs-2"></div>
            <div class="col-xs-5 text-center">
                <span class="resultsP2">
                    <% if (p2rankDelta > 0) { %>Rank up: +<%= p2rankDelta %><% } else if (p2rankDelta < 0) { %>Rank down: <%= p2rankDelta %><% } %>
                </span>
            </div>
        </div>
    </script>