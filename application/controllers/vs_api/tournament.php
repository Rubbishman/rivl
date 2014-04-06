<?php

class Tournament extends CI_Controller {

    public function __construct(){
        parent::__construct();
        $this->load->library('challonge', array('api_key'=>'WJvXsWEvj3uudClo0uWd1fHIJOH07rYyOO0mFQiA'));
        $this->challonge->verify_ssl = false;
    }

    public function index() {

        $method = $this->input->server('REQUEST_METHOD');
        if ($method == 'GET' && isset($_GET['id'])) {
            $this->get_tournament($_GET['id']);
        }
        else {
            $this->output->set_status_header(500,'unknown request method');
            $this->output->set_output();
        }
    }

    public function get_tournament($id) {

        try {

            //$tournament_id = 894159;
            $challlongeParams = array("include_matches" => 1,"include_participants" => 1);
            $res = $this->challonge->getTournament($id, $challlongeParams);
            $this->_render($res);
        }
        catch (Exception $e) {
            $this->output->set_status_header(500,$e->getMessage());
            $this->output->set_output();
        }
    }

    public function update_match() {

        $params = $_GET;

        try {

            $challongeParams = array(
                "match[scores_csv]" => $params['score'],
                "match[winner_id]" => $params['winner_id']
            );
            $res = $this->challonge->updateMatch($params['tournament_id'], $params['match_id'], $challongeParams);
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
