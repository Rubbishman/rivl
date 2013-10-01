<?php
class Competitor_model extends CI_Model {
	public function __construct()
	{
		$this->load->database();
	}
	
	public function get_competitor($competition_id,$id = FALSE)
	{
		if($competition_id == FALSE){
			return;
		}
		$this->db->select('competitor_elo.competitor_id, competitor_elo.elo ,competitor.name, COUNT(CASE WHEN score.rank = 1 THEN 1 ELSE NULL END) wins, COUNT(CASE WHEN score.rank != 1 THEN 1 ELSE NULL END) loses');
		$this->db->from('competitor');
		$this->db->join('competitor_elo', 'competitor.id = competitor_elo.competitor_id');
        $this->db->join('score', 'score.competitor_id = competitor.id');
		$this->db->where('competitor_elo.competition_id', $competition_id);
        $this->db->group_by('competitor.id');
		$this->db->order_by('competitor_elo.elo desc, competitor.name asc');
		
		if ($id === FALSE)
		{
			$query = $this->db->get();
			return $query->result();
		}
		
		$this->db->where('competitor.id', $id);
		
		$query = $this->db->get();
		return $query->result();
	}
}


