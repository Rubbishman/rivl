<script id="newScoreTemplate" type="text/template">

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
    </script>