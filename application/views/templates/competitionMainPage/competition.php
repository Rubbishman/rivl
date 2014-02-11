<script id="competitionTemplate" type="text/template">

        <h1><%=name%> Leaderboard</h1>
        <div class="sectionBody">
            <div id="competitors"></div>
        </div>
		<a id="addPlayer">Is your name missing?</a>
        <div id="addPlayerDiv" class="hidden">
            Name: <input type="text" id ="addPlayerName" name="firstname"> <button id="addPlayerButton">Add player</button>
        </div>
		<!--<h1>Titles</h1>-->
		<!--<div class="sectionBody">-->
			<!--<div id="titleSection"></div>-->
		<!--</div>-->
		
        <h2>Game History</h2>
        <div class="sectionBody">
        	<div id="gameHistoryTodayContent">
	        	<h4>Today</h4>
                <div id="gameHistoryToday"></div>
            </div>
            <div id="gameHistoryYesterdayContent">
	            <h4>Yesterday</h4>
                <div id="gameHistoryYesterday"></div>
            </div>
            <h4 id="noGameHistory">No games today or yesterday</h4>
        </div>
    </script>