<?php

class Game_Saver extends CI_Controller{

    public function __construct(){
        parent::__construct();
        $this->load->model('game_model');
    }

    public function index() {
        $method = $this->input->server('REQUEST_METHOD');
		
        if ($method == 'GET') {
            $this->new_game();
        }
        else {
            $this->output->set_status_header(400,'unknown request method');
			$this->output->set_output('DAFAQ'); die();
        }
    }

    public function delete_game() {
        try {
            if($_SERVER['REMOTE_ADDR'] != 'localhost') {
                return;
            }

            $game_id = $this->input->get('game_id');

            if(!$game_id) {
                $this->output->set_status_header(400,'No game_id!');
                $this->output->set_output('DAFAQ'); die();
            }

            $res = $this->game_model->delete_game($game_id);

            if($res == true) {
                $response = 'OK!';
                $this->_render($response);
            } else {
                $this->output->set_status_header(500,'Could not delete game');
                $this->output->set_output('DAFAQ'); die();
            }
        } catch (Exception $e) {
            $this->output->set_status_header(500,$e->getMessage());
            $this->output->set_output('DAFAQ'); die();
        }



    }

    public function recalculate_games() {
        $this->game_model->recalculate_games();
//        $response = array('data'=>$res);
//        $this->_render($response);
        echo 'DONE!';
    }

    private function new_game() {

        try {
            $games = $this->input->get('gameModels');
            if (!$games) {
                $this->output->set_status_header(400,'No game submitted ');
				$this->output->set_output('DAFAQ'); die();
            }
            // $game= json_decode($game_JSON);
            // if (!$game) {
                // $this->output->set_status_header(400,'JSON parse error when reading game: '+$game_JSON);
				// $this->output->set_output('DAFAQ'); die();
            // }
            $game_ids = array();
			foreach ($games as $game) {
                $game_id = $this->game_model->save_game($game);
                array_push($game_ids, $game_id);
            }

            $response = array('data'=>array('ids'=>$game_ids));
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
