<script id="tournamentMatchGridTemplate" type="text/template">

    <!--<div class="matchIdentifier">-->
    <!--    <span><%=identifier%></span>-->
    <!--</div>-->

    <div class="matchGrid">
        <% if (gridPos == 'up') { %>
            <div class="matchGridUp"></div>
            <div class="matchGridNone"></div>
        <% } else if (gridPos == 'down') { %>
            <div class="matchGridNone"></div>
            <div class="matchGridDown"></div>
        <% } else if (gridPos == 'horizontal') { %>
            <div class="matchGridHoriz"></div>
            <div class="matchGridNone"></div>
        <% } else { %>
            <div class="matchGridNone"></div>
            <div class="matchGridNone"></div>
        <% } %>
    </div>
</script>