<?php

class Game extends CI_Controller{

    public function __construct(){
        parent::__construct();
        $this->load->model('game_model');
    }

    public function index() {
        $method = $this->input->server('REQUEST_METHOD');
		
        if ($method == 'POST') {
            $this->new_game();
        }
        else if ($method == 'DELETE') {
            $this->delete_game();
        }
        else if ($method == 'GET') {
            $this->get_game();
        }
        else {
            $this->output->set_status_header(400,'unknown request method');
			$this->output->set_output('DAFAQ'); die();
        }

    }

    public function get_game() {

        $params = $_GET;

        try {

            if (isset($params['id'])) {
                $res = $this->game_model->get_game($params['id']);
            } else {
                $res = $this->game_model->get_games($params);
				
				if(true) { //Clumped game history...
					$clump = array();
					$clumpIndex = -1;
					
					foreach($res as $game) {
						$this->combine_clump($clump, $clumpIndex, $game);
					}
				}
            }
			
            $this->_render($clump);
        }
        catch (Exception $e) {
            $this->output->set_status_header(500,$e->getMessage());
			$this->output->set_output('DAFAQ'); die();
        }
    }

	private function combine_clump(&$clump, &$clumpIndex, $new_data) {
		if($clumpIndex == -1) {
			$clump[]= $this->gen_new_clump($new_data);
			$clumpIndex++;
		} else if($clump[$clumpIndex]['p1']['id'] == $new_data['winner_id']
			&& $clump[$clumpIndex]['p2']['id'] == $new_data['loser_id']
			&& $clump[$clumpIndex]['today'] == $new_data['today']) {
					
			$clump[$clumpIndex]['p1']['wins'] += 1;
			$clump[$clumpIndex]['p1']['elo_change'] += $new_data['winner_elo_change'];
			$clump[$clumpIndex]['p2']['elo_change'] += $new_data['loser_elo_change'];
				
		} else if($clump[$clumpIndex]['p2']['id'] == $new_data['winner_id']
			&& $clump[$clumpIndex]['p1']['id'] == $new_data['loser_id']
			&& $clump[$clumpIndex]['today'] == $new_data['today']){
				
			$clump[$clumpIndex]['p2']['wins'] += 1;
			$clump[$clumpIndex]['p2']['elo_change'] += $new_data['winner_elo_change'];
			$clump[$clumpIndex]['p1']['elo_change'] += $new_data['loser_elo_change'];
		} else {
			
			if($clump[$clumpIndex]['p2']['wins'] > $clump[$clumpIndex]['p1']['wins']
				|| ($clump[$clumpIndex]['p2']['wins'] == $clump[$clumpIndex]['p1']['wins']
					&& $clump[$clumpIndex]['p2']['elo_change'] > $clump[$clumpIndex]['p1']['elo_change'])) {
				$temp = $clump[$clumpIndex]['p2'];
				
				$clump[$clumpIndex]['p2'] = $clump[$clumpIndex]['p1'];
				$clump[$clumpIndex]['p1'] = $temp;
			}
			
			$clump[]= $this->gen_new_clump($new_data);
			$clumpIndex++;
		}
	}
	
	private function gen_new_clump($new_data) {
		return array(
				'p1' => array(
					'id' => $new_data['winner_id'],
					'name' => $new_data['winner_name'],
					'wins' => 1,
					'elo_change' => $new_data['winner_elo_change']),
				'p2' => array(
					'id' => $new_data['loser_id'],
					'name' => $new_data['loser_name'],
					'wins' => 0,
					'elo_change' => $new_data['loser_elo_change']),
				'today' => $new_data['today']
				);
	}
	
    public function new_game() {

        try {
            $game_JSON = $this->input->post('model');
            if (!$game_JSON) {
                $this->output->set_status_header(400,'No game submitted '.var_dump($_SERVER).var_dump($_POST).var_dump($_GET));
				$this->output->set_output('DAFAQ'); die();
            }
            $game= json_decode($game_JSON);
            if (!$game) {
                $this->output->set_status_header(400,'JSON parse error when reading game: '+$game_JSON);
				$this->output->set_output('DAFAQ'); die();
            }

            if (isset($game->id)) {
                unset($game->id);
            }

            $game_id = $this->game_model->save_game($game->model);

            $response = array('data'=>array('id'=>$game_id));
            $this->_render($response);

        }
        catch (Exception $e) {
            $this->output->set_status_header(500,$e->getMessage());
			$this->output->set_output('DAFAQ'); die();
        }
    }


    public function save_game() {

        try {

            $game_JSON = $this->input->put('model');
            if (!$game_JSON) {
                $this->output->set_status_header(500,'No Game submitted');
				$this->output->set_output('DAFAQ'); die();
            }
            $game= json_decode($game_JSON);
            if (!$game) {
                $this->output->set_status_header(500,'JSON parse error when reading Game');
				$this->output->set_output('DAFAQ'); die();
            }

            if (!isset($game->id)) {
                $this->output->set_status_header(500,'Game is missing ID');
				$this->output->set_output('DAFAQ'); die();
            }

            $game_id = $this->game_model->save_game($game);

            $response = array('data'=>array('id'=>$game_id), 'status_code'=>($game_id ? "0" : "1"));
            $this->_render($response);

        }
        catch (Exception $e) {
            $this->output->set_status_header(500,$e->getMessage());
			$this->output->set_output('DAFAQ'); die();
        }
    }

    public function delete_game() {

        $game_id = $this->input->get('id');

        try {

            if (!$game_id) {
                $this->output->set_status_header(500,'No Game ID specified');
				$this->output->set_output('DAFAQ'); die();
            }

            $res = $this->game_model->delete_game($game_id);

            $response = array('data'=>array("deleted"=>$res), 'status_code'=>("0"));
            $this->_render($response);

        }
        catch (Exception $e) {
            $this->output->set_status_header(500,$e->getMessage());
			$this->output->set_output('DAFAQ'); die();
        }
    }


    private function _render($list) {

        $data = array();
        $data['output'] = $list;

        $this->load->view('vs_ajax', $data);
    }


}
