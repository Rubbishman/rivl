<script id="tournamentMatchTemplate" type="text/template">

    <div style="float:left; padding-top:18px; width:20px;">
        <span><%=identifier%></span>
    </div>
    <div style="float:left; width:120px;">
        <% if (nick1) { %>
            <span class='playerLink' data-id=<%=rivlId1 %>>
                <img src="img/avatars/2_<%=rivlId1%>_1.png?ver=5" style="width:20px; height:20px; margin:3px;" />
                <%=nick1%>
                <% if (winner === rivlId1) { %>(W)<% } %>
            </span>
        <% } else { %>
            <span style="font-size:11px;">
                <img src="img/avatars/anonymous.png?ver=5" style="width:20px; height:20px; margin:3px;" />
                <em><%=prereq1%></em>
            </span>
        <% } %>
        <br />
        <% if (nick2) { %>
            <span class='playerLink' data-id=<%=rivlId2 %>>
                <img src="img/avatars/2_<%=rivlId2%>_1.png?ver=5" style="width:20px; height:20px; margin:3px;"/>
                <%=nick2%>
                <% if (winner === rivlId2) { %>(W)<% } %>
            </span>
        <% } else { %>
            <span style="font-size:11px;">
                <img src="img/avatars/anonymous.png?ver=5" style="width:20px; height:20px; margin:3px;" />
                <em><%=prereq2%></em>
            </span>
        <% } %>
    </div>
    <div style="float:left; padding-top:18px;">
        <% if (!complete) { %>
            <a class='enterChallongeResult' data-p1=<%=rivlId1 %> data-p2=<%=rivlId2 %> data-matchid=<%=id %>>?</a>
        <% } %>
    </div>
</script>