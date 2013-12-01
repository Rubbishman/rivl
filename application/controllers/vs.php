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
		
		$this->load->view('header',$data);
		
		$this->load->view('templates/navigator',$data);

		$this->load->view('templates/playerPage/playerPage',$data);
		$this->load->view('templates/playerPage/playerStatRow',$data);
		$this->load->view('templates/playerPage/gameHistoryRow',$data);
		
		$this->load->view('templates/competitionMainPage/competition',$data);
		$this->load->view('templates/competitionMainPage/gameHistoryRow',$data);
		$this->load->view('templates/competitionMainPage/competitorRow',$data);
		$this->load->view('templates/competitionMainPage/titleRow',$data);
		
		$this->load->view('templates/newGamePage/newGame',$data);
		$this->load->view('templates/newGamePage/newplayerSelectRow',$data);
		$this->load->view('templates/newGamePage/newResults',$data);
		$this->load->view('templates/newGamePage/newScore',$data);
		
		$this->load->view('index',$data);
		
	}


}