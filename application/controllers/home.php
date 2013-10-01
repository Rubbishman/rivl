<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Home extends CI_Controller {


	public function __construct()
	{
		parent::__construct();
		$this->load->model('competition_model');
	}

	public function index()
	{

		$data['competition'] = $this->competition_model->get_competition(1);

		if (empty($data['competition']))
		{
			show_404();
		}

		$data['title'] = 'vs';
		$this->load->view('header', $data);	
		$this->load->view('home', $data);	
		$this->load->view('footer', $data);	
	}
}