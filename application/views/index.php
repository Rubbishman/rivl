<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
    <title>Rivl!</title>

    <link rel="shortcut icon" href="<?=base_url("/favicon.ico" )?>"/>
    <link rel="stylesheet" href="<?=base_url("/css/bootstrap.css")?>"  media="screen"/>

    <style>
        body {
            padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
        }
    </style>

    <link rel="stylesheet" href="<?=base_url("/css/bootstrap-responsive.css")?>"  media="screen"/>
    <link rel="stylesheet" href="<?=base_url("/css/main.css")?>"  media="screen"/>

</head>

<body>


    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="brand" href="#">Project name</a>
          <div class="nav-collapse collapse">
            <ul class="nav">
              <li class="active"><a href="#">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>


    <div id="mainContainer" class="container">

    </div>


    <!-- Templates -->
    <script id="competitionRowTemplate" type="text/template">
        <a><%=name%></a>
    </script>

    <script id="competitionTemplate" type="text/template">

        <img class="titleGraphic" src=<?=base_url("/img/graphic.png")?> />
        <h1>Competition: <%=name%></h1>
        <div id="newGame"></div>
        <h2><a href="http://192.168.2.202/vs-master/vs_api/competitor_graph/get_all_graphs?competition_id=2">Graph Beta</a></h2>
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
    
    <script id="newGame2Template" type="text/template">
            
        <div class="row text-center">
            <div class="span12">
                <select id="player1">
                    <option value=''></option>
                </select>
                <span> vs </span>
                <select id="player2">
                    <option value=''></option>
                </select>
            </div>
        </div>
        <div id="scoresSection" class="row text-center">
        </div>
        <div class="row text-center">
            <div class="span12">
                <button id="addScore">Add another score</button>
                <button id="submitScore">Submit scores</button>
            </div>
        </div>

    </script>

    <script id="newScoreTemplate" type="text/template">

        <div class="scoreRow span12">
            <select class="score1">
                <option value=''></option>
                <?php for($i = 11; $i >= 0; $i--) { ?>
                    <option value='<?=$i?>'><?=$i?></option>
                <?php } ?>
            </select>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <select class="score2">
                <option value=''></option>
                <?php for($i = 11; $i >= 0; $i--) { ?>
                    <option value='<?=$i?>'><?=$i?></option>
                <?php } ?>
            </select>
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
    <script src=<?=base_url("/js/lib/bootstrap.js")?>></script>

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
    <script src=<?=base_url("/js/views/newGameView2.js")?>></script>
    <script src=<?=base_url("/js/views/gameHistoryView.js")?>></script>
    <script src=<?=base_url("/js/views/competitorSelectionRow.js")?>></script>
    <script src=<?=base_url("/js/views/gameRow.js")?>></script>
    <script src=<?=base_url("/js/views/allCompetitionsView.js")?>></script>
    <script src=<?=base_url("/js/views/competitionView.js")?>></script>
    <script src=<?=base_url("/js/router.js")?>></script>


</body>
</html>