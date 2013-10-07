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
		
		$graphData = array('playerName' => 'All Competitors','data' => array(), 'labels' => array());
		
		foreach($allCompetitors as $competitor){
			$res = $this->game_model->get_elo_graph(array(
            'competitor_id' => $competitor->competitor_id,
            'competition_id' => $this->input->get('competition_id')));
			
			if(count($res) > $maxGames) {
				$maxGames = count($res);
			}
			
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
					
			foreach($res as $elo_change){
	            //$graphData['data'][] = $elo_change['elo_change'];
	            $playerGames->data[] = $elo_change['elo_after'];
        	}
			$graphData['data'][] = $playerGames;
		}

        for($i = 0; $i <= $maxGames; $i++){
            $graphData['labels'][] = $i;
        }

		//$this->_render($graphData);
        $this->load->view('competitor_graph',$graphData);
	}

    private function get_graph(){
		$competitor = $this->competitor_model->get_competitor($this->input->get('competition_id'),$this->input->get('competitor_id'));
		
		$params = array(
            'competitor_id' => $this->input->get('competitor_id'),
            'competition_id' => $this->input->get('competition_id'));
		
        $res = $this->game_model->get_elo_graph($params);

		$stat_details = $this->game_model->get_competitor_stats($params);

        $graphData = array(
        	'playerName' => $competitor[0]->name,
        	'data' => array(1500), 
        	'labels' => array(),
			'stat_details' => array(
				'avg_loss_score' => $competitor[0]->avg_loss_score,
				'avg_opp_loss_score' => $competitor[0]->avg_opp_loss_score,
				'stat_array' => $stat_details));
		
		$red = round(rand(0,255));
		$green = round(rand(0,255));
		$blue = round(rand(0,255));
		
		$playerGames = (Object)array(
			'player' => $competitor->name,
			'playerId' => $competitor->competitor_id,
			'fillColor' => "rgba(".$red.",".$green.",".$blue.",0.5)",
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

        $this->load->view('competitor_graph',$graphData);
        //$this->_render($graphData);
    }

    private function _render($list) {

        $data = array();
        $data['output'] = $list;

        $this->load->view('vs_ajax', $data);
    }

}