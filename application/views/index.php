
    <div id="mainContainer" class="container">

    </div>


    <!-- Templates -->

    <script id="notifications" type="text/template">
        Notifications go here
    </script>

    <script id="competitionRowTemplate" type="text/template">
        <a><%=name%></a>
    </script>

	<script id="competitionGraphTemplate" type="text/template">
		<h1><%=name%> Graph</h1>
		<canvas id="mainGraph" width="1024" height="728"></canvas>
	</script>

    <script src="https://login.persona.org/include.js"></script>
    <script src=<?=base_url("/js/lib/json2.js")?>></script>
    <script src=<?=base_url("/js/lib/jquery-1.7.1.js")?>></script>
    <script src=<?=base_url("/js/lib/underscore.js")?>></script>
    <script src=<?=base_url("/js/lib/backbone.js")?>></script>
    <script src=<?=base_url("/js/lib/bootstrap.js")?>></script>
	<script src=<?=base_url("/js/lib/Chart.js")?>></script>
    <script src=<?=base_url("/js/lib/fastclick.js")?>></script>

	<script type="text/javascript">
	    navigator.id.watch({
	        loggedInUser: <?= $email ? "'$email'" : 'null' ?>,
	        // A user has logged in! Here you need to:
		    // 1. Send the assertion to your backend for verification and to create a session.
		    // 2. Update your UI.
			onlogin: function(assertion) {

			    $.ajax({ /* <-- This example uses jQuery, but you can use whatever you'd like */
				      type: 'POST',
				      url: "<?=base_url('/auth/login')?>", // This is a URL on your website.
				      data: {assertion: assertion},
				      success: function(res, status, xhr) {
				      	$('#login').hide();
				      	$('#logout').show();
				      	$('#notifications').show();
				      },
				      error: function(xhr, status, err) {
				        navigator.id.logout();
				        $('#login').show();
				      	$('#logout').hide();
				      	$('#notifications').hide();
				      }
			    });
		  	},
		  onlogout: function() {
			    // A user has logged out! Here you need to:
			    // Tear down the user's session by redirecting the user or making a call to your backend.
			    // Also, make sure loggedInUser will get set to null on the next page load.
			    // (That's a literal JavaScript null. Not false, 0, or undefined. null.)
			    $.ajax({
			      type: 'POST',
			      url: "<?=base_url('/auth/logout')?>", // This is a URL on your website.
			      success: function(res, status, xhr) {
			      	$('#login').show();
			      	$('#logout').hide();
			      	$('#notifications').hide();
		      	},
			      error: function(xhr, status, err) { alert("Logout failure: " + err); }
			    });
		   }
	    });
    </script>

	<script type="text/javascript">
			$(function() {
	    		$('#mainContainer').on('click','#login',function(){
	    			navigator.id.request();
	    		});
	    		$('#mainContainer').on('click','#logout',function(){
	    			navigator.id.logout();
	    		});
			});
	</script>

    <script src=<?=base_url("/js/vs.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/models/addPlayer.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/models/competition.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/models/competitionCollection.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/models/competitor.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/models/competitionGraph.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/models/competitorStat.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/models/competitorCollection.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/models/game.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/models/gameSaver.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/models/gameCollection.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/models/title.js?moo=")?><?=$randomlol?>></script>
	<script src=<?=base_url("/js/models/titleCollection.js?moo=")?><?=$randomlol?>></script>


    <script src=<?=base_url("/js/views/competitionRow.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/views/titleRow.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/views/titleView.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/views/competitorRow.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/views/competitorView.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/views/competitionGraphView.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/views/competitorStatView.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/views/newGameView2.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/views/gameHistoryView.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/views/gameRow.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/views/allCompetitionsView.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/views/competitionView.js?moo=")?><?=$randomlol?>></script>
    <script src=<?=base_url("/js/router.js?moo=")?><?=$randomlol?>></script>


</body>
</html>
