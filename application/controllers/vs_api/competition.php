<?php

class Competition extends CI_Controller {

    public function __construct(){
        parent::__construct();
        $this->load->model('competition_model');
		$this->load->model('competitor_model');
        $this->load->model('game_model');
    }

    public function index() {

        $method = $this->input->server('REQUEST_METHOD');
        if ($method == 'POST') {
            $this->new_competition();
        }
        else if ($method == 'DELETE') {
            $this->delete_competition();
        }
        else if ($method == 'PUT') {
            $this->save_competition();
        }
        else if ($method == 'GET') {
            $this->get_competition();
        }
        else {
            $this->output->set_status_header(500,'unknown request method');
			$this->output->set_output();
        }
    }
	
	public function competitors() {
		$method = $this->input->server('REQUEST_METHOD');
		if ($method == 'GET') {
            $this->get_competitors();
        }
        else {
            $this->output->set_status_header(500,'unknown request method');
			$this->output->set_output();
        }
	}

	public function get_competitors() {
		$params = $_GET;

        try {

            if (isset($params['competition_id'])) {
                $res = $this->competitor_model->get_competitor($params['competition_id'],FALSE);
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

    public function get_competition() {
        $params = $_GET;

        try {

            if (isset($params['id'])) {
                $res = $this->competition_model->get_competition($params['id']);
            } else {
                $res = $this->competition_model->get_competitions($params);
            }
            
            $this->_render($res);
        }
        catch (Exception $e) {
            $this->output->set_status_header(500,$e->getMessage());
			$this->output->set_output();
        }
    }


    public function new_competition() {

        try {

            $competition_JSON = $this->input->post('model');
            if (!$competition_JSON) {
                $this->output->set_status_header(500,'No competition submitted');
				$this->output->set_output();
            }
            $competition= json_decode($competition_JSON);
            if (!$competition) {
                $this->output->set_status_header(500,'JSON parse error when reading competition');
				$this->output->set_output();
            }

            if (isset($competition->id)) {
                unset($competition->id);
            }

            if (isset($competition->name) && $competition->name) {

                $competition_id = $this->competition_model->save_competition($competition);

                $response = array('data'=>array('id'=>$competition_id), 'status_code'=>($competition_id ? "0" : "1"));
                $this->_render($response);

            }
            else {
                $this->output->set_status_header(500,'Competition is missing name');
				$this->output->set_output();
            }

        }
        catch (Exception $e) {
            $this->output->set_status_header(500,$e->getMessage());
			$this->output->set_output();
        }
    }


    public function save_competition() {

        try {

            $competition_JSON = $this->input->put('model');
            if (!$competition_JSON) {
                $this->output->set_status_header(500,'No Competition submitted');
				$this->output->set_output();
            }
            $competition= json_decode($competition_JSON);
            if (!$competition) {
                $this->output->set_status_header(500,'JSON parse error when reading Competition');
				$this->output->set_output();
            }

            if (!isset($competition->id)) {
                $this->output->set_status_header(500,'Competition is missing ID');
				$this->output->set_output();
            }

            $competition_id = $this->competition_model->save_competition($competition);

            $response = array('data'=>array('id'=>$competition_id), 'status_code'=>($competition_id ? "0" : "1"));
            $this->_render($response);

        }
        catch (Exception $e) {
            $this->output->set_status_header(500,$e->getMessage());
			$this->output->set_output();
        }
    }

    public function delete_competition() {

        $competition_id = $this->input->get('id');

        try {

            if (!$competition_id) {
                $this->output->set_status_header(500,'No Competition ID specified');
				$this->output->set_output();
            }

            $res = $this->competition_model->delete_competition($competition_id);

            $response = array('data'=>array("deleted"=>$res), 'status_code'=>("0"));
            $this->_render($response);

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
