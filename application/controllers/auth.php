<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Auth extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->library('persona');
	}

	public function index()
	{
		$this->output->set_status_header(400,'Do not call like this baddie');
        $this->output->set_output('DAFAQ'); die();
	}

	public function login()
	{
		$assertion = $this->input->post('assertion');
		$result = $this->persona->verifyAssertion($assertion);
		var_dump($assertion);
		echo "\n";
		var_dump($result);
		if($result->status === 'okay') {
			$this->input->set_cookie(array(
				'name' => 'user_email',
				'value' => $result->email));
			$this->output->set_status_header(200,'OK!');
			die();
		} else {
			$this->output->set_status_header(400,'Bad hacker you!');
        	$this->output->set_output('DAFAQ'); die();
		}
	}

	public function logout()
	{

	}
}