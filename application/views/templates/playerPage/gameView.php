<script id="gameViewTemplate" type="text/template">
	<div class="gameViewBorder">
		<div class="row">
			<div class="col-xs-4">
			    <div class="row">
			        <div class="col-xs-4"><img id="gameView_winner" src="img/avatars/2_<%=winner_id%>_1.png?ver=5" class="mediumAvatar roundAvatar avatarLink" /></div>
			        <div class="col-xs-4"><span class="vs">vs...</span></div>
			    	<div class="col-xs-4"><img id="gameView_winner" src="img/avatars/2_<%=loser_id%>_1.png?ver=5" class="mediumAvatar roundAvatar avatarLink" /></div>
			    </div>
			    <div class="row">
			        <div class="col-xs-4"><%=winner_name%></div>
			        <div class="col-xs-4"><%=date%></div>
			        <div class="col-xs-4"><%=loser_name%></div>
			    </div>
			    <div class="row">
			        <div class="col-xs-4 eloGood"><%=winner_elo_change%></div>
			        <div class="col-xs-4"></div>
			        <div class="col-xs-4 eloBad"><%=loser_elo_change%></div>
			    </div>
			</div>
			<div class="col-xs-3">
				<span class="notesHeader">Notes:</span>
				<div id="noteAnchor"></div>
			</div>
			<div class='col-xs-5'></div>
		</div>
    </div>
</script>
 