<script id="gameViewTemplate" type="text/template">
	<div class="row">
	    <div class="row text-center">
	        <div class="col-xs-4">
	        	<img id="gameView_winner" src="img/avatars/2_<%=winner_id%>_1.png?ver=<?=IMAGE_VERSION?>" class="mediumAvatar roundAvatar avatarLink" /><br />
	        	<%=winner_name%><br />
        		<span class="rankUp"><span class="glyphicon glyphicon-circle-arrow-up"></span> <%=winner_elo_change%></span>
	        </div>
	        <div class="col-xs-4">
	        	<span class="vs">vs</span><br />
	        	<%=date%>
	        </div>
	    	<div class="col-xs-4">
	    		<img id="gameView_winner" src="img/avatars/2_<%=loser_id%>_1.png?ver=<?=IMAGE_VERSION?>" class="mediumAvatar roundAvatar avatarLink" /><br />
		    	<%=loser_name%><br />
		    	<span class="rankDown"><span class="glyphicon glyphicon-circle-arrow-down"></span> <%=loser_elo_change%></span>
		    	
		    </div>
	    </div>
	</div>
</script>
 