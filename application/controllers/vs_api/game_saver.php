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

    public function new_game() {

        try {
            $game = $this->input->get('model');
            if (!$game) {
                $this->output->set_status_header(400,'No game submitted ');
				$this->output->set_output('DAFAQ'); die();
            }
            // $game= json_decode($game_JSON);
            // if (!$game) {
                // $this->output->set_status_header(400,'JSON parse error when reading game: '+$game_JSON);
				// $this->output->set_output('DAFAQ'); die();
            // }
			
            $game_id = $this->game_model->save_game($game);

            $response = array('data'=>array('id'=>$game_id));
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
