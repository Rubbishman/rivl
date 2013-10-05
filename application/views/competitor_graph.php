<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Rivl!</title>

<link rel="shortcut icon" href="<?=base_url("/favicon.ico" )?>"/>
    <script src=<?=base_url("/js/lib/json2.js")?>></script>
    <script src=<?=base_url("/js/lib/jquery-1.7.1.js")?>></script>
    <script src=<?=base_url("/js/lib/underscore.js")?>></script>
    <script src=<?=base_url("/js/lib/backbone.js")?>></script>
    <script src=<?=base_url("/js/lib/Chart.js")?>></script>
    <script>
    	$(function() {
    		mainGraph = $("#mainGraph").get(0).getContext("2d");
    		data = {
				labels : <?=json_encode($labels)?>,
				datasets : <?=json_encode($data)?>
			};
			myNewChart = new Chart(mainGraph).Line(data);
    	});
    </script>
</head>

<body>

    <img src=<?=base_url("/images/graphic.png")?> />

	<h2><?=$playerName?></h2>

    <canvas id="mainGraph" width="1024" height="728"></canvas>



    



</body>
</html>