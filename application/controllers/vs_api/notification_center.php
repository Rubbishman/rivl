<?php

class Notification_Center extends CI_Controller{

    public function __construct(){
        parent::__construct();
        $this->load->model('game_verification_model');
    }

    public function index() {
        $method = $this->input->server('REQUEST_METHOD');
		
        if ($method == 'GET') {
            $this->get_verifications();
        }
        else {
            $this->output->set_status_header(400,'unknown request method');
			$this->output->set_output('DAFAQ'); die();
        }
    }

	private function get_verifications() {
		
		$competitor_id = $this->input->get('competitor_id');
		
		$results = $this->game_verification_model->get_games_awaiting_verification();
		
		$this->_render($results);
	}
	
	private function _render($list) {

        $data = array();
        $data['output'] = $list;

        $this->load->view('vs_ajax', $data);
    }
}
