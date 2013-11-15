<?php

class Competitor extends CI_Controller {

    public function __construct(){
        parent::__construct();
		$this->load->model('competitor_model');
    }

    public function index() {
		
        $method = $this->input->server('REQUEST_METHOD');
        if ($method == 'GET') {
            $this->save_competitor();
        }
        else {
            $this->output->set_status_header(500,'unknown request method');
			$this->output->set_output();
        }
    }
	
	private function save_competitor() {
		$this->competitor_model->save_competitor($this->input->get('name'),$this->input->get('competition_id'));
	}
}