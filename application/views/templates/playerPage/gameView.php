<script id="gameViewTemplate" type="text/template">
    <div class="row">
        <div class="col-xs-1"></div>
        <div class="col-xs-1"><%=date%></div>
        <div class="col-xs-6"></div>
    </div>
    <div class="row">
        <div class="col-xs-1"><img id="gameView_winner" src="img/avatars/2_<%=winner_id%>_1.png?ver=5" class="mediumAvatar roundAvatar avatarLink" /></div>
        <div class="col-xs-1"><span class="vs">vs...</span></div>
    	<div class="col-xs-8"><img id="gameView_winner" src="img/avatars/2_<%=loser_id%>_1.png?ver=5" class="mediumAvatar roundAvatar avatarLink" /></div>
    </div>
    <div class="row">
        <div class="col-xs-1"><%=winner_name%></div>
        <div class="col-xs-1"></div>
        <div class="col-xs-8"><%=loser_name%></div>
    </div>
    <div class="row">
        <div class="col-xs-1"><%=winner_elo_change%></div>
        <div class="col-xs-1"></div>
        <div class="col-xs-8"><%=loser_elo_change%></div>
    </div>
</script>
 