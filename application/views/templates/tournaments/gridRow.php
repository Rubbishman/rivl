<script id="tournamentMatchGridTemplate" type="text/template">

    <div class="matchIdentifier">
        <span><%=identifier%></span>
    </div>

    <div class="matchGrid">
        <% if (gridPos == 'up') { %>
            <div class="gridLine gridLineUp"></div>
            <div class="gridLine gridLineNone"></div>
        <% } else if (gridPos == 'down') { %>
            <div class="gridLine gridLineNone"></div>
            <div class="gridLine gridLineDown"></div>
        <% } else if (gridPos == 'horizontal') { %>
            <div class="gridLine gridLineHoriz"></div>
            <div class="gridLine gridLineNone"></div>
        <% } else { %>
            <div class="gridLine gridLineNone"></div>
            <div class="gridLine gridLineNone"></div>
        <% } %>
    </div>
</script>