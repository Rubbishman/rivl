<?php

class Title_Calculator extends CI_Controller {

    public function __construct(){
        parent::__construct();
        $this->load->model('title_model');
    }

    public function index() {

        $method = $this->input->server('REQUEST_METHOD');
        if ($method == 'GET') {
            $this->get_titles();
        }
        else {
            $this->output->set_status_header(500,'unknown request method');
			$this->output->set_output();
        }
    }

	public function recalculate_titles(){
		$this->title_model->recalculate_titles();
		$this->output->set_status_header(200,'Titles recalculated');
		$this->output->set_output('Titles recalculated');
	}

	private function get_titles() {
		$params = $_GET;

        try {

            if (isset($params['competition_id'])) {
            	if(isset($params['competitor_id'])) {
            		$res = $this->title_model->get_competitor_titles($params['competition_id'],$params['competitor_id']);
            	} else {
            		$res = $this->title_model->get_competitor_titles($params['competition_id'],FALSE);
            	}
                
            } else {
                $this->output->set_status_header(500,'No competition id supplied');
				$this->output->set_output();
            }
            
            $this->_render($res);
        }
        catch (Exception $e) {
            $this->output->set_status_header(500,$e->getMessage());
			$this->output->set_output();
        }
	}

    private function _render($list) {

        $data = array();
        $data['output'] = $list;

        $this->load->view('vs_ajax', $data);
    }


}
