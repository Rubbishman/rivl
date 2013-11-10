<?php
class Title_Model extends CI_Model {
	public function __construct()
	{
		$this->load->database();
	}
	
	public function get_competitor_titles($competition_id, $competitor_id = FALSE) {
		if(!isset($competition_id)) {
			return;
		}
		$this->db->select('title, competitor.name as title_holder, description, competitor.id as title_competitor_id');
		$this->db->from('title');
		$this->db->join('competitor','title.current_competitor_id = competitor.id');
		
		$this->db->where('title.competition_id',$competition_id);
		
		if($competitor_id != FALSE) {
			$this->db->where('title.current_competitor_id',$competitor_id);
		}
		
		$query = $this->db->get();
		$results = $query->result();
		return $results;
	}
	
	public function recalculate_titles($competition_id) {
		
	}
}
