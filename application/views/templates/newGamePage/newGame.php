<script id="newGame2Template" type="text/template">
	<h1><%=name%></h1>
    <% if (tournament) { %>
        <h2><%=tournament['name']%> tournament match</h2>
    <% } %>
    <div class="newGameContainer sectionBody text-center">
        <div id="playerSection" class="row text-center">
            <div id="selectPlayer1" class="col-xs-5">
                <img src="img/avatars/selectPlayer.jpg" />
            </div>
            <div id="vsLabel" class="col-xs-2">
            </div>
            <div id="selectPlayer2" class="col-xs-5 text-center">
                <img src="img/avatars/selectPlayer.jpg" />
            </div>
        </div>

        <div id="winnerBtns" class="row text-center" style="display: none;">
            <div class="col-xs-5">
                <button id="player1Btn" class="btn btn-default btn-block addScore"></button>
            </div>
            <div class="col-xs-2">Select winner</div>
            <div class="col-xs-5 text-center">
                <button id="player2Btn" class="btn btn-default btn-block addScore"></button>
            </div>
        </div>
        
        <div id="scoresSection" class="row"></div>
        <div id="resultsSection" class="row"></div>

        <button id="removeScore" class="btn-sm btn" style="display: none;">Remove score</button>
        <button id="submitScore" class="btn btn-lg btn-disabled btn-block" style="display: none;">Save result</button>
    </div>


        <div id="playerSelectModal" class="modal fade">
            <div class="modal-dialog">
                <div class="modal-content row">
                    <div class="modal-header col-xs-6 columns">
                        <h4 class="modal-title">Player 1</h4>
                    </div>
                    <div class="modal-header col-xs-6 columns">
                        <h4 class="modal-title">Player 2</h4>
                    </div>
                    <div class="modal-body">
                        <ul id="left_player_select" class="list-group col-xs-6"></ul>
                        <ul id="right_player_select" class="list-group col-xs-6"></ul>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->
</script>
