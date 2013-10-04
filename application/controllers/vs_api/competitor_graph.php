<?php

class Competitor_Graph extends CI_Controller{

    public function __construct(){
        parent::__construct();
        $this->load->model('game_model');
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

    private function get_graph(){
        $res = $this->game_model->get_elo_graph(array(
            'competitor_id' => $this->input->get('competitor_id'),
            'competition_id' => $this->input->get('competition_id')));

        $graphData = array('data' => array(), 'labels' => array());


        for($i = 1; $i <= count($res); $i++){
            $graphData['labels'][] = '"'.$i.'"';
        }

        foreach($res as $elo_change){
            $graphData['data'][] = $elo_change['elo_change'];
        }

        $this->load->view('competitor_graph',$graphData);
        //$this->_render($graphData);
    }

    private function _render($list) {

        $data = array();
        $data['output'] = $list;

        $this->load->view('vs_ajax', $data);
    }

}