
<!-- the old way: -->
        <!--
        <div class="scoreRow span12">
            <div class="col-xs-6 text-center">
                <select class="scoreP1">
                    <option value=''></option>
                    <% for (var i = points; i >= 0; i--) { %>
                        <option value='<%= i %>'><%= i %></option>
                    <% } %>
                </select>
            </div>
            <div class="col-xs-6 text-center">
                <select class="scoreP2">
                    <option value=''></option>
                    <% for (var i = points; i >= 0; i--) { %>
                        <option value='<%= i %>'><%= i %></option>
                    <% } %>
                </select>
            </div>
        </div>
        -->

<script id="newScoreTemplate" type="text/template">

        <div class="scoreRow row">
            <div class="col-xs-5 text-center">
                <button type="button" class="player1Btn btn btn-default btn-block">Winner</button>
            </div>
            <div class="col-xs-2 text-center gameNumber">Game 1</div>
            <div class="col-xs-5 text-center">
                <button type="button" class="player2Btn btn btn-default btn-block">Winner</button>
            </div>
        </div>

    </script>