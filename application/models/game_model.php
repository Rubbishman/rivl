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
		$this->db->select('score.id, score.game_id, game.date, competitor.name, score.rank, score.score, 
                                (score.elo_after - score.elo_before) elo_change, score_details.detail_id');
		$this->db->from('game');
		$this->db->join('score', 'game.id = score.game_id');
        $this->db->join('competitor', 'score.competitor_id = competitor.id');
        $this->db->join('score_details', 'score_details.score_id = score.id', 'left outer');
		$this->db->order_by('game.id desc,score.rank asc');
		$this->db->where(array('game.competition_id' => $params['competition_id']));

		// foreach ($params as $key => $value) {
			// $this->db->where('game.'.$key, $value);
		// }
		

		$query = $this->db->get();
		
		return $query->result();
	}

	public function get_competitor_games($competition_id, $competitor_id) {
		$res =$this->db->query('select game.date, 
		CASE WHEN s1.rank = 1 THEN c1.name ELSE c2.name END winner_name, 
    CASE WHEN s1.rank = 2 THEN c1.name ELSE c2.name END loser_name,
    CASE WHEN s1.rank = 1 THEN s1.score ELSE s2.score END winner_score,
    CASE WHEN s1.rank = 2 THEN s1.score ELSE s2.score END loser_score,
    CASE WHEN s1.rank = 1 THEN (s1.elo_after - s1.elo_before) ELSE (s2.elo_after - s2.elo_before) END winner_elo_change,
    CASE WHEN s1.rank = 2 THEN (s1.elo_after - s1.elo_before) ELSE (s2.elo_after - s2.elo_before) END loser_elo_change
    from score s1 
    	join game on s1.game_id = game.id
        join score s2 on s1.game_id = s2.game_id 
            and s1.competitor_id != s2.competitor_id
        join competitor c1 on c1.id = s1.competitor_id
        join competitor c2 on c2.id = s2.competitor_id
    where s1.competitor_id = '.$competitor_id.'
    	and game.competition_id = '.$competition_id.'
    	order by game.date desc');
		return $res->result_array();
	}

	public function get_competitor_stats($params) {
		
		$res =$this->db->query('select count(CASE WHEN s1.rank = 1 THEN 1 ELSE null END) win_num, 
    count(CASE WHEN s1.rank = 2 THEN 1 ELSE null END) loss_num,
    CAST((count(CASE WHEN s1.rank = 1 THEN 1 ELSE null END)/(count(CASE WHEN s1.rank = 1 THEN 1 ELSE null END) + count(CASE WHEN s1.rank = 2 THEN 1 ELSE null END)))*100 as DECIMAL(4,1)) win_percent,
    AVG(s1.score) avg_score,
    AVG(s2.score) avg_opp_score,
    c1.name player, c2.name opponent_name
    from score s1 
    	join game on s1.game_id = game.id
        join score s2 on s1.game_id = s2.game_id 
            and s1.competitor_id != s2.competitor_id
        join competitor c1 on c1.id = s1.competitor_id
        join competitor c2 on c2.id = s2.competitor_id
    where s1.competitor_id = '.$params['competitor_id'].'
    	and game.competition_id = '.$params['competition_id'].'
    group by s1.competitor_id, s2.competitor_id
    order by count(1) desc;');
		return $res->result_array();
		/*
		 select count(CASE WHEN s1.rank = 1 THEN 1 ELSE null END) win_num, 
    count(CASE WHEN s1.rank = 2 THEN 1 ELSE null END) loss_num,
    AVG(CASE WHEN s1.rank = 2 THEN s1.score ELSE null END) avg_loss_score,
    c1.name player, c2.name opponent
    from score s1 
        join score s2 on s1.game_id = s2.game_id 
            and s1.competitor_id != s2.competitor_id
        join competitor c1 on c1.id = s1.competitor_id
        join competitor c2 on c2.id = s2.competitor_id
    where s1.competitor_id = 1
    group by s1.competitor_id, s2.competitor_id;

select AVG(CASE WHEN rank = 2 THEN score ELSE null END) avg_loss_score from score where competitor_id = 1 group by competitor_id;
		 */
	}

    public function get_elo_graph($params = FALSE) {
        //$this->db->select('(score.elo_after - score.elo_before) elo_change');
        $this->db->select('game_id, score.elo_after');
        $this->db->from('game');
        $this->db->join('score', 'game.id = score.game_id');
        $this->db->join('competitor', 'score.competitor_id = competitor.id');
        $this->db->order_by('game.id', 'asc');
        $this->db->where(array('game.competition_id' => $params['competition_id']));
        $this->db->where(array('score.competitor_id' => $params['competitor_id']));

        $query = $this->db->get();

        return $query->result_array();
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
        $this->db->order_by('date', 'asc');
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

            $this->db->select('count(CASE WHEN competitor_id = '.$game['winner_id'].' THEN 1 ELSE NULL END) winner_games, count(CASE WHEN competitor_id = '.$game['loser_id'].' THEN 1 ELSE NULL END) loser_games');
            $this->db->from('score');
            $this->db->where('game_id <',$game['game_id']);
            $game_number = $this->db->get()->row_array();

            $elo_after = elo_helper($winner_details['elo'],$loser_details['elo'],$game_number['winner_games'],$game_number['loser_games']);

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
                $winner_details['detail'] = $result['detail'];
			} else if($result['rank'] == 2){
				$loser_details = $res;
				$loser_details['score'] = $result['score'];
                $loser_details['detail'] = $result['detail'];
			}
		}

		//TODO make this handle doubles etc.

        $this->db->select('count(CASE WHEN competitor_id = '.$winner_details['competitor_id'].' THEN 1 ELSE NULL END) winner_games, count(CASE WHEN competitor_id = '.$loser_details['competitor_id'].' THEN 1 ELSE NULL END) loser_games');
        $this->db->from('score');
        $game_number = $this->db->get()->row_array();

		$elo_after = elo_helper($winner_details['elo'],$loser_details['elo'],$game_number['winner_games'],$game_number['loser_games']);

        $game_insert_array = array('competition_id' => $new_data['competition_id'], 'status' => 'pending');
        if (isset($new_data['date'])) {
            $game_insert_array['date'] = $new_data['date'];
        }
        $this->db->insert('game', $game_insert_array);
    	$game_id = $this->db->insert_id();

        //save winner
    	$this->db->insert('score', 
    		array(
    			'game_id' => $game_id,
    			'competitor_id' => $winner_details['competitor_id'],
    			'rank' => 1,
    			'score' => $winner_details['score'],
    			'elo_before' => $winner_details['elo'],
    			'elo_after' => $elo_after['winner_elo']));
        $winning_score_id = $this->db->insert_id();
		
        if (isset($winner_details['detail']) && isset($loser_details['detail'])) {

            $detail_id = $this->_find_or_create_detail_id($new_data['competition_id'], $winner_details['detail']);
            $this->db->insert('score_details', 
                array(
                    'score_id' => $winning_score_id,
                    'detail_id' => $detail_id));;
        }


		$this->db->where(array(
				'competitor_id' => $winner_details['competitor_id'],
				'competition_id' => $new_data['competition_id']));
		$this->db->update('competitor_elo',
			array('elo' => $elo_after['winner_elo']));
		



        //save loser
		$this->db->insert('score', 
    		array(
    			'game_id' => $game_id,
    			'competitor_id' => $loser_details['competitor_id'],
    			'rank' => 2,
    			'score' => $loser_details['score'],
    			'elo_before' => $loser_details['elo'],
    			'elo_after' => $elo_after['loser_elo']));
        $losing_score_id = $this->db->insert_id();
        
        if (isset($winner_details['detail']) && isset($loser_details['detail'])) {

            $detail_id = $this->_find_or_create_detail_id($new_data['competition_id'], $loser_details['detail']);
            $this->db->insert('score_details', 
                array(
                    'score_id' => $losing_score_id,
                    'detail_id' => $detail_id));;
        }

		$this->db->where(array(
				'competitor_id' => $loser_details['competitor_id'],
				'competition_id' => $new_data['competition_id']));
		$this->db->update('competitor_elo',
			array('elo' => $elo_after['loser_elo']));
			
		foreach($new_data['results'] as $result){
			
			$status = "pending";
			if($result['confirmed']) {
				$status = 'confirmed';
			}
			
			$this->db->insert('game_verification',
				array(
					'game_id' => $game_id,
					'competitor_id' => $result['competitor_id'],
					'status' => $status));	
		}
			
        return $game_id;
	}

    private function _find_or_create_detail_id($competition_id, $detail) {

        $this->db->select('id');
        $this->db->from('detail');
        $this->db->where('competition_id', $competition_id);
        $this->db->where('name', $detail);
        $results = $this->db->get()->row_array();
        if (!empty($results)) {

            return $results['id'];

        } else {

            $this->db->insert('game_details', 
                array(
                    'competition_id' => $competition_id,
                    'detail_set_id' => 1,
                    'name' => $detail));
            return $this->db->insert_id();
        }
    }
}