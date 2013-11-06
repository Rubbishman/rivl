<?php

class Liam_Wireframe extends CI_Controller {

    public function __construct(){
        parent::__construct();

    }

    public function index() {

        $this->load->view('liam_wireframe', array());
    }

}
