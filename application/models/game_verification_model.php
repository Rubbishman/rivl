<?php
class Game_Verification_model extends CI_Model {

	public function __construct()
	{
		$this->load->database();
	}
	
	public function get_games_awaiting_verification($competitor_id) {
		$this->db->select('gv.game_id, CASE WHEN s1.rank = 1 THEN s1.name ELSE s2.name END winner, 
			CASE WHEN s1.rank = 2 THEN s1.name ELSE s2.name END loser,
			CASE WHEN s1.rank = 1 THEN s1.score ELSE s2.score END winner_score,
			CASE WHEN s1.rank = 2 THEN s1.score ELSE s2.score END winner_score');
		$this->db->from('game_verification gv');
		$this->db->join('score s1','gv.game_id s1.game_id');
		$this->db->join('competitor c1','c1.competitor_id s1.game_id');
		$this->db->join('score s2','gv.game_id s2.game_id');
		$this->db->join('competitor c2','c2.competitor_id s2.game_id');
		$this->db->where(array('gv.competitor_id' => $competitor_id));
	}
}