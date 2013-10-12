<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Vs extends CI_Controller {


	public function __construct()
	{
		parent::__construct();
	}

	public function index()
	{
		$data = array(
			'email' => $this->input->cookie('user_email', TRUE),
			'assertion' => $this->input->cookie('assertion', TRUE));
		$this->load->view('index',$data);	
	}


}