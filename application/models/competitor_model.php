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
		}/*
		$this->db->select('competitor_elo.competitor_id, competitor_elo.elo ,competitor.name,
			 COUNT(CASE WHEN s1.rank = 1 THEN 1 ELSE NULL END) wins, 
			 COUNT(CASE WHEN s1.rank != 1 THEN 1 ELSE NULL END) loses,
			 AVG(CASE WHEN s1.rank = 2 THEN s1.score ELSE null END) avg_loss_score,
			 AVG(CASE WHEN s2.rank = 2 THEN s2.score ELSE null END) avg_opp_loss_score');*/
		$this->db->select('competitor_elo.competitor_id, competitor_elo.elo ,competitor.name');
		$this->db->from('competitor');
		$this->db->join('competitor_elo', 'competitor.id = competitor_elo.competitor_id');
        //$this->db->join('game', 'game.competition_id = competitor_elo.competition_id','left	');
        //$this->db->join('score s1', 's1.competitor_id = competitor.id and s1.game_id = game.id','left');
		//$this->db->join('score s2', 's1.game_id = s2.game_id and s1.competitor_id != s2.competitor_id and s2.game_id = game.id','left');
		$this->db->where('competitor_elo.competition_id', $competition_id);
        $this->db->group_by('competitor.id');
		$this->db->order_by('competitor_elo.elo desc, competitor.name asc');
		
		if ($id !== FALSE) {
			$this->db->where('competitor.id', $id);
		}
		
		$query = $this->db->get();
		$results = $query->result();

		//apply rank
		if ($id === FALSE) {
			$rank = 1;
			foreach ($results as $competitor) {
				$competitor->rank = $rank;
				$rank++;
			}
		}

		return $results;
	}
}


