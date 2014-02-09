<?php

class Competitor_Graph extends CI_Controller{

    public function __construct(){
        parent::__construct();
        $this->load->model('game_model');
		$this->load->model('competitor_model');
    }

    public function index() {
        $method = $this->input->server('REQUEST_METHOD');

        if ($method == 'GET') {
            $this->get_graph();
        }
        else {
            $this->output->set_status_header(400,'unknown request method');
            $this->output->set_output('DAFAQ'); die();
        }
    }

	public function get_all_graphs() {
		$allCompetitors = $this->competitor_model->get_competitor($this->input->get('competition_id'));
		
		$maxGames = 0;
		
		$graphData = (Object)array('title' => 'All Competitors','series' => array());

		foreach($allCompetitors as $competitor) {
			$res = $this->game_model->get_elo_graph(array(
            'competitor_id' => $competitor->competitor_id,
            'competition_id' => $this->input->get('competition_id')));
			
			$red = round(rand(0,255));
			$green = round(rand(0,255));
			$blue = round(rand(0,255));
			
			$playerGames = (Object)array(
				'title' => $competitor->name,
				'points' => array());
			
			$graphData->series[] = $playerGames;
			
			$firstElo = true;
			$lastTime = 0;
			$lastTimeCount = 0;
			foreach($res as $elo_change){
	            if($firstElo) {
	            	$playerGames->points[] = (Object)array("x" => $elo_change['game_date']-(60*60*24), "y" => 1500);
					$firstElo = false;
	            }
				if(abs($lastTime - $elo_change['game_date']) < (60*60*24)) {
					continue;
				} else {
					$lastTime = $elo_change['game_date'];
				}
	            $playerGames->points[] = (Object)array("x" => $elo_change['game_date'], "y" => $elo_change['elo_after']);
        	}
		}

		$this->_render($graphData);
	}

    private function get_graph(){
		$competitor = $this->competitor_model->get_competitor($this->input->get('competition_id'),$this->input->get('competitor_id'));

		$params = array(
            'competitor_id' => $this->input->get('competitor_id'),
            'competition_id' => $this->input->get('competition_id'));
		
        $res = $this->game_model->get_elo_graph($params);

		$stat_details = $this->game_model->get_competitor_stats($params);

        $max_games = 1;

        foreach($stat_details as &$stat){
            if($stat['win_num'] + $stat['loss_num'] > $max_games) {
                $max_games = $stat['win_num'] + $stat['loss_num'];
            }
        }
		
		foreach($stat_details as &$stat){
			$stat['gamePercent'] = (($stat['win_num'] + $stat['loss_num'])/$max_games)*100;
		}
        
        $graphData = array(
        	'playerName' => $competitor[0]->name,
            'player_id' => $competitor[0]->competitor_id,
        	'data' => array(1500), 
        	'labels' => array(),
			'stat_details' => array(
				// 'avg_loss_score' => $competitor[0]->avg_loss_score,
				// 'avg_opp_loss_score' => $competitor[0]->avg_opp_loss_score,
				'stat_array' => $stat_details));
		
		$red = round(rand(0,255));
		$green = round(rand(0,255));
		$blue = round(rand(0,255));
		
		$playerGames = (Object)array(
			'player' => $competitor->name,
			'playerId' => $competitor->competitor_id,
			'fillColor' => "rgba(0,0,0,0)",
			'strokeColor' => "rgba(".$red.",".$green.",".$blue.",1)",
			'pointColor' => "rgba(".$red.",".$green.",".$blue.",1)",
			'pointStrokeColor' => "#fff",
			'data' => array(1500));


        for($i = 0; $i <= count($res); $i++){
            $graphData['labels'][] = $i;
        }

        foreach($res as $elo_change){
            //$graphData['data'][] = $elo_change['elo_change'];
            $playerGames->data[] = $elo_change['elo_after'];
        }

		$graphData['data'] = array($playerGames);

		$gameHistory = $this->game_model->get_competitor_games($this->input->get('competition_id'),$this->input->get('competitor_id'));
		$graphData['gameHistory'] = $gameHistory;
		
		$recent_games = array();
		$recent_game_order = array();
		$last_opponent = 0;
		foreach($gameHistory as $recent_game) {
			if($last_opponent == $recent_game['opponent_id']) {
				if($recent_game['player_won']) {
					$recent_games[$recent_game['opponent_id']]['won'] 
						= $recent_games[$recent_game['opponent_id']]['won']+1;
				} else {
					$recent_games[$recent_game['opponent_id']]['lost']
						= $recent_games[$recent_game['opponent_id']]['lost']+1;
				}
			} else if(!isset($recent_games[$recent_game['opponent_id']])) {
				if(count($recent_games) < 4) {
					$last_opponent = $recent_game['opponent_id'];
					
					$recent_games[$recent_game['opponent_id']] = array(
						'opponent_id' => $recent_game['opponent_id'],
						'opponent_name' => $recent_game['opponent_name'],
						'won' => $recent_game['player_won'] ? 1 : 0,
						'lost' => $recent_game['player_won'] ? 0 : 1);
						
					$recent_game_order[] = $recent_game['opponent_id'];
				} else {
					break;
				}
			}
		}
		$graphData['recentGames'] = array();
		
		foreach($recent_game_order as $order) {
			if($recent_games[$order]['won'] > $recent_games[$order]['lost']) {
				$recent_games[$order]['highlight'] = 1;
			} else if($recent_games[$order]['won'] < $recent_games[$order]['lost']) {
				$recent_games[$order]['highlight'] = -1;
			} else {
				$recent_games[$order]['highlight'] = 0;
			}
			$graphData['recentGames'][] = $recent_games[$order];
		}
		
		$graphData['recentGameWhiteSpace'] =  (4 - count($graphData['recentGames'])) * 2;
		
        $competitor_simple_stat = $this->competitor_model->get_competitor_simple_stats($this->input->get('competition_id'),$this->input->get('competitor_id'));

        $graphData['current_elo'] = $competitor_simple_stat->elo;
        $graphData['games_won'] = $competitor_simple_stat->wins;
        $graphData['games_played'] = $competitor_simple_stat->games;
        $graphData['games_won_percent'] = $competitor_simple_stat->games_won_percent;
        $graphData['rank'] = $competitor_simple_stat->rank;
        $graphData['total_competitors'] = $competitor_simple_stat->total_competitors;

        //$this->load->view('competitor_graph',$graphData);
        $this->_render($graphData);
    }

    private function _render($list) {

        $data = array();
        $data['output'] = $list;

        $this->load->view('vs_ajax', $data);
    }

}