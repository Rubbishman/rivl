<script id="newGame2Template" type="text/template">

        <div class="newGameContainer sectionBody">
            <div id="playerSection" class="row text-center">
                <div id="selectPlayer1" class="col-xs-5">
                    <img src="img/avatars/anonymous.png" />
                    <br />
                    <span></span>
                </div>
                <div id="vsLabel" class="col-xs-2">
                </div>
                <div id="selectPlayer2" class="col-xs-5 text-center">
                    <img src="img/avatars/anonymous.png" />
                    <br />
                    <span></span>
                </div>
            </div>
            <div id="scoresSection" class="row"></div>
            <div id="resultsSection" class="row"></div>

            <div id="buttonsSection" class="row">
                <div class="col-xs-12 text-center">
                    <button id="addScore" class="btn btn-sm btn-default">Add another score</button>
                    <button id="removeScore" class="btn btn-sm btn-danger">Remove last score</button>
                    <button id="submitScore" class="btn btn-lg btn-success btn-block">Save scores</button>
                </div>
            </div>
            <a id="addPlayer">Is your name missing?</a>
            <div id="addPlayerDiv" class="hidden">
                Name: <input type="text" id ="addPlayerName" name="firstname"> <button id="addPlayerButton">Add player</button>
            </div>
        </div>



            <div id="playerSelectModal" class="modal fade">
                <div class="modal-dialog">
                    <div class="modal-content row">
                        <div class="modal-header">
                            <h4 class="modal-title">Select players</h4>
                        </div>
                        <div class="modal-body">
                            <ul id="left_player_select" class="list-group col-xs-6"></ul>
                            <ul id="right_player_select" class="list-group col-xs-6"></ul>
                        </div>
                    </div><!-- /.modal-content -->
                </div><!-- /.modal-dialog -->
            </div><!-- /.modal -->
    </script>