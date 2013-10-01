<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Rivl!</title>

</head>

<body>

    <img src=<?=base_url("/images/graphic.png")?> />

    <div id="mainContainer">

    </div>


    <!-- Templates -->
    <script id="competitionRowTemplate" type="text/template">
        <a><%=name%></a>
    </script>

    <script id="competitionTemplate" type="text/template">
        <h1>Competition: <%=name%></h1>
        <div id="newGame"></div>
        <h2>Competitors:</h2>
        <table id="competitors"></table>
        <h2>Game History:</h2>
        <table id="gameHistory"></table>
    </script>
    
    <script id="newGameTemplate" type="text/template">
    	<h2>Make new <%=name%> game</h2>
    	<div style="margin-left: 50px;">
    		
		<table>
			<tr>
				<td><Strong>Winner:</Strong></td> <td><select id="winner"></select></td>
			</tr>
			<tr>
				<td><Strong>Score:</Strong></td>
				<td>
					<strong id="winner_score">11</strong>
				</td>
			</tr>
			<tr>
				<td><Strong>Loser:</Strong></td> <td><select id="loser"></select></td>
			</tr>
			<tr>
				<td><Strong>Score:</Strong></td>
				<td>
					<select id="loser_score">
			    		<?php
			    			for($i = 0; $i < 11; $i++) {
						?>
			    				<option value='<?=$i?>'><?=$i?></option>
						<?php		
			    			}
			    		?>
			    	</select>
				</td>
                <td>Notes: in case of deuce put 10pts for the loser</td>
			</tr>
		</table>
    	<button id="makeGame">Make game</button>
    	</div>
    </script>
    
    <script id="competitorSelectionRowTemplate" type="text/template">
    	<option value="<%=competitor_id%>"><%=name%></option>
    </script>
    
    <script id="competitorRowTemplate" type="text/template">
        <% var elo = Math.round(elo); %>
    	<td><Strong>Name:</Strong><%=name%></td>
    	<td><Strong>Elo:</Strong><%=elo%></td>
        <td>(:)</td>
        <% var games = Number(wins) + Number(loses); %>
        <td class="details" hidden> Games: <%=games%> (W:<%=wins%>,L:<%=loses%>)</td>
    </script>

    <script id="gameRowTemplate" type="text/template">
        <% if(rank == 2) { %>
    			<td>
    		<% } else { %>
    			<td style="border-top: 1px;border-top-style: solid;border-top-color: #112211;">
    		<% } %>
    		<%=date%></td>
        <% if(rank == 2) { %>
    			<td>
    		<% } else { %>
    			<td style="border-top: 1px;border-top-style: solid;border-top-color: #112211;">
    		<% } %>
    		Game <%=game_id%></td>
        <% if(rank == 2) { %>
    			<td>
    		<% } else { %>
    			<td style="border-top: 1px;border-top-style: solid;border-top-color: #112211;">
    		<% } %>
        	Rank: <%=rank%> 
        	<% if(rank == 1) { %>
    			(Winner)
    		<% } %>
        </td>
        <% if(rank == 2) { %>
    			<td>
    		<% } else { %>
    			<td style="border-top: 1px;border-top-style: solid;border-top-color: #112211;">
    		<% } %>
    		Player: <%=name%></td>
        <% if(rank == 2) { %>
    			<td>
    		<% } else { %>
    			<td style="border-top: 1px;border-top-style: solid;border-top-color: #112211;">
    		<% } %>
    		Score: <%=score%> pts</td>
        <% if(rank == 2) { %>
        <td>
            <% } else { %>
        <td style="border-top: 1px;border-top-style: solid;border-top-color: #112211;">
            <% }  %>
            Elo Diff: <%=elo_change%></td>
    </script>


    <script src=<?=base_url("/js/lib/json2.js")?>></script>
    <script src=<?=base_url("/js/lib/jquery-1.7.1.js")?>></script>
    <script src=<?=base_url("/js/lib/underscore.js")?>></script>
    <script src=<?=base_url("/js/lib/backbone.js")?>></script>
    
    <script src=<?=base_url("/js/vs.js")?>></script>
    <script src=<?=base_url("/js/models/competition.js")?>></script>
    <script src=<?=base_url("/js/models/competitionCollection.js")?>></script>
    <script src=<?=base_url("/js/models/competitor.js")?>></script>
    <script src=<?=base_url("/js/models/competitorCollection.js")?>></script>
    <script src=<?=base_url("/js/models/game.js")?>></script>
    <script src=<?=base_url("/js/models/gameSaver.js")?>></script>
    <script src=<?=base_url("/js/models/gameCollection.js")?>></script>

    <script src=<?=base_url("/js/views/competitionRow.js")?>></script>
    <script src=<?=base_url("/js/views/competitorRow.js")?>></script>
    <script src=<?=base_url("/js/views/competitorView.js")?>></script>
    <script src=<?=base_url("/js/views/newGameView.js")?>></script>
    <script src=<?=base_url("/js/views/gameHistoryView.js")?>></script>
    <script src=<?=base_url("/js/views/competitorSelectionRow.js")?>></script>
    <script src=<?=base_url("/js/views/gameRow.js")?>></script>
    <script src=<?=base_url("/js/views/allCompetitionsView.js")?>></script>
    <script src=<?=base_url("/js/views/competitionView.js")?>></script>
    <script src=<?=base_url("/js/router.js")?>></script>


</body>
</html>