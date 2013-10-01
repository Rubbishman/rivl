<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Competition extends CI_Controller {


	public function __construct()
	{
		parent::__construct();
		$this->load->model('competition_model');
	}

	public function index()
	{

		$id = isset($_GET['id']) ? $_GET['id'] : 1;
		$data['competition'] = $this->competition_model->get_competition($id);

		if (empty($data['competition']))
		{
			show_404();
		}

		$this->load->view('header', $data);	
		$this->load->view('competition', $data);	
		$this->load->view('footer', $data);	
	}

}