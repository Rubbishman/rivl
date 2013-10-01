<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Vs extends CI_Controller {


	public function __construct()
	{
		parent::__construct();
	}

	public function index()
	{
		$this->load->view('index');	
	}


}