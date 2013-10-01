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
            }
			
            $this->_render($res);
        }
        catch (Exception $e) {
            $this->output->set_status_header(500,$e->getMessage());
			$this->output->set_output('DAFAQ'); die();
        }
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
