<script id="navbarTemplate" type="text/template">
        <div class="navbar navbar-inverse navbar-fixed-top">
          <div class="container">
            <div class="navbar-header">
              <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <a class="navbar-brand" href="#">rivl</a>
            </div>
            <div class="collapse navbar-collapse">
              <% if (id !== 0) { %>
              <ul class="nav navbar-nav">
                <li><a href="#competition/<%=id%>">Home</a></li>
                <li><a href="#competition/<%=id%>/game">Enter scores</a></li>
                <!--<li><a href="#">Compare rivls</a></li>-->
                <li><a href="#competition_graph/<%=id%>">Graph</a></li>
                <li id="notifications" class="hide"><a href="#competitor_home/<%=id%>">Notifications <span class="badge">4</span></a></li>
                <li id="login" class="hide"><a>Login</a></li>
                <li id="logout" class="hide"><a>Logout</a></li>
              </ul>
              <% } %>
            </div><!--/.nav-collapse -->
          </div>
        </div>

    </script>