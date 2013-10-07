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

	<h1><?=$playerName?></h1>
	
	<h3>Stats:</h2>
	<?php
	if(isset($stat_details)) {
		?>
		Avg opponent loss score: <?=$stat_details['avg_opp_loss_score']?><br>
		Avg loss score: <?=$stat_details['avg_loss_score']?><br>
		<hr>
		<table>
			<?php
		foreach($stat_details['stat_array'] as $vsOppStat) {
			?>
			<tr>
			<td>Name:<?=$vsOppStat['opponent_name']?><td>
			<td>Wins:<?=$vsOppStat['win_num']?><td>
			<td>Avg opponent loss score:<?=$vsOppStat['avg_win_opp_score']?><td>
			<td>Losses:<?=$vsOppStat['loss_num']?><td>
			<td>Avg loss score:<?=$vsOppStat['avg_loss_score']?><td>
			</tr>
			<?php
		}
		?>
		</table>
		<?php
	}
	?>
	<h3>Graph:</h3>
    <canvas id="mainGraph" width="1024" height="728"></canvas>



    



</body>
</html>