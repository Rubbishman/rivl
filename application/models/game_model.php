<?php
class Game_model extends CI_Model {

	private $game_fields = array('date', 'competition_id');
	private $score_fields = array('game_id', 'competitor_id', 'detail_id', 'score');

	public function __construct()
	{
		$this->load->database();
		$this->load->helper('elo_helper');
	}

	public function get_game($id = FALSE) {

		if ($id === FALSE) {
			return FALSE;
		}
		
		$this->db->from('game');
		$this->db->join('score', 'game.id = score.game_id');
		$this->db->join('competitor', 'score.competitor_id = competitor.id');
		$this->db->where(array('game.id' => $id));

		$query = $this->db->get();
		//var_dump($this->db->last_query());
		return $query->row_array();
	}

	public function get_games($params = FALSE) {
		$this->db->select('score.id, score.game_id, game.date, competitor.name, score.rank, score.score, (score.elo_after - score.elo_before) elo_change');
		$this->db->from('game');
		$this->db->join('score', 'game.id = score.game_id');
		$this->db->join('competitor', 'score.competitor_id = competitor.id');
		$this->db->order_by('game.date desc,score.rank asc');
		$this->db->where(array('game.competition_id' => $params['competition_id']));
		// foreach ($params as $key => $value) {
			// $this->db->where('game.'.$key, $value);
		// }
		

		$query = $this->db->get();
		
		return $query->result();
	}

    public function delete_game($game_id = FALSE) {
        if(!$game_id) {
            return false;;
        }
        $this->db->where('id',$game_id);
        $this->db->delete('game');

        $this->db->where('game_id',$game_id);
        $this->db->delete('score');

        $this->recalculate_games();

        return true;
    }

    public function recalculate_games() {
        $this->db->update('competitor_elo',array('elo' => 1500));

        $this->db->select('max(CASE WHEN rank = 1 THEN competitor_id ELSE NULL END) winner_id, max(CASE WHEN rank = 2 THEN competitor_id ELSE NULL END) loser_id, game_id, competition_id');
        $this->db->from('score');
        $this->db->join('game','game.id = score.game_id');
        $this->db->group_by('game_id');
        $allGames = $this->db->get()->result_array();

        foreach($allGames as &$game) {
            $this->db->from('competitor_elo');
            $this->db->where('competitor_elo.competition_id',$game['competition_id']);
            $this->db->where('competitor_elo.competitor_id',$game['winner_id']);
            $res = $this->db->get()->row_array();
            $winner_details = $res;

            $this->db->from('competitor_elo');
            $this->db->where('competitor_elo.competition_id',$game['competition_id']);
            $this->db->where('competitor_elo.competitor_id',$game['loser_id']);
            $res = $this->db->get()->row_array();
            $loser_details = $res;

            $game['winner_elo_before'] = $winner_details['elo'];
            $game['loser_elo_before'] = $loser_details['elo'];

            $elo_after = elo_helper($winner_details['elo'],$loser_details['elo']);

            $game['winner_elo_after'] = $elo_after['winner_elo'];
            $game['loser_elo_after'] = $elo_after['loser_elo'];


            $this->db->where(array(
                'competitor_id' => $winner_details['competitor_id'],
                'competition_id' => $game['competition_id']));
            $this->db->update('competitor_elo',
                array('elo' => $elo_after['winner_elo']));


            $this->db->where(array(
                'competitor_id' => $loser_details['competitor_id'],
                'competition_id' => $game['competition_id']));
            $this->db->update('competitor_elo',
                array('elo' => $elo_after['loser_elo']));


            $this->db->where(array(
                'competitor_id' => $loser_details['competitor_id'],
                'game_id' => $game['game_id']));
            $this->db->update('score',
                array(
                    'elo_after' => $elo_after['loser_elo'],
                    'elo_before' => $loser_details['elo']));


            $this->db->where(array(
                'competitor_id' => $winner_details['competitor_id'],
                'game_id' => $game['game_id']));
            $this->db->update('score',
                array(
                    'elo_after' => $elo_after['winner_elo'],
                    'elo_before' => $winner_details['elo']));
        }


        return $allGames;
    }

	public function save_game($new_data = FALSE) {

		if ($new_data === FALSE || !$new_data['competition_id'] || !$new_data['results']) {
			return FALSE;
		}
		
		foreach($new_data['results'] as $result){
			
			$this->db->from('competitor_elo');
			$this->db->where('competitor_elo.competition_id',$new_data['competition_id']);
			$this->db->where('competitor_elo.competitor_id',$result['competitor_id']);
			$res = $this->db->get()->row_array();
			if($result['rank'] == 1){
				$winner_details = $res;
				$winner_details['score'] = $result['score'];
			} else if($result['rank'] == 2){
				$loser_details = $res;
				$loser_details['score'] = $result['score'];
			}
		}

		//TODO make this handle doubles etc.

		$elo_after = elo_helper($winner_details['elo'],$loser_details['elo']);

        $this->db->insert('game', array('competition_id' => $new_data['competition_id']));
    	$game_id = $this->db->insert_id();

    	$this->db->insert('score', 
    		array(
    			'game_id' => $game_id,
    			'competitor_id' => $winner_details['competitor_id'],
    			'rank' => 1,
    			'score' => $winner_details['score'],
    			'elo_before' => $winner_details['elo'],
    			'elo_after' => $elo_after['winner_elo']));
		

		$this->db->where(array(
				'competitor_id' => $winner_details['competitor_id'],
				'competition_id' => $new_data['competition_id']));
		$this->db->update('competitor_elo',
			array('elo' => $elo_after['winner_elo']));
		
		$this->db->insert('score', 
    		array(
    			'game_id' => $game_id,
    			'competitor_id' => $loser_details['competitor_id'],
    			'rank' => 2,
    			'score' => $loser_details['score'],
    			'elo_before' => $loser_details['elo'],
    			'elo_after' => $elo_after['loser_elo']));

		$this->db->where(array(
				'competitor_id' => $loser_details['competitor_id'],
				'competition_id' => $new_data['competition_id']));
		$this->db->update('competitor_elo',
			array('elo' => $elo_after['loser_elo']));
			
        return $game_id;
	}

}