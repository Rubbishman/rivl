<?php
class Competitor_model extends CI_Model {
	public function __construct()
	{
		$this->load->database();
	}
	
	public function save_competitor($name, $competition_id) {
		$this->db->select('name,id');
		$this->db->from('competitor');
		$this->db->where('name',$name);
		
		$result = $this->db->get();
		$result = $result->result();

		if(count($result) === 0) {
			$this->db->insert('competitor',array('name' => $name));
			$competitor_id = $this->db->insert_id();
		} else {
			$competitor_id = $result[0]->id;
		}
		
		$this->db->select('elo');
		$this->db->from('competitor_elo');
		$this->db->where('competitor_id',$competitor_id);
		$this->db->where('competition_id',$competition_id);
		
		$result = $this->db->get();
		$result = $result->result();
		if(count($result) === 0) {
			$this->db->insert('competitor_elo',array(
				'competitor_id' => $competitor_id,
				'competition_id' => $competition_id,
				'elo' => 1500));
		} 
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
        $this->db->where('competitor.status','active');
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

    public function get_competitor_simple_stats($competition_id,$id = FALSE) {
        if($competition_id == FALSE || $id == FALSE){
            return;
        }
        $this->db->select('competitor_elo.competitor_id, competitor_elo.elo ,competitor.name,
			 COUNT(CASE WHEN s1.rank = 1 THEN 1 ELSE NULL END) wins,
			 COUNT(CASE WHEN s1.rank != 1 THEN 1 ELSE NULL END) loses');
        $this->db->select('competitor_elo.competitor_id, competitor_elo.elo ,competitor.name');
        $this->db->from('competitor');
        $this->db->join('competitor_elo', 'competitor.id = competitor_elo.competitor_id');
        $this->db->join('game', 'game.competition_id = competitor_elo.competition_id','left	');
        $this->db->join('score s1', 's1.competitor_id = competitor.id and s1.game_id = game.id','left');
        $this->db->where('competitor_elo.competition_id', $competition_id);
        $this->db->group_by('competitor.id');
        $this->db->where('competitor.id', $id);

        $query = $this->db->get();
        $results = $query->result();
        $results = $results[0];

        $rankInfo = $this->get_competitor($competition_id,false);
        $totalCompetitors = 0;
        foreach($rankInfo as $rank) {
            $totalCompetitors++;
            if($rank->competitor_id == $id) {
                if($rank->rank%100 > 3 && $rank->rank%100 < 21){
                    $results->rank = $rank->rank."th";
                } else if($rank->rank%10 == 1) {
                    $results->rank = $rank->rank."st";
                } else if($rank->rank%10 == 2) {
                    $results->rank = $rank->rank."nd";
                } else if($rank->rank%10 == 3) {
                    $results->rank = $rank->rank."rd";
                } else {
                    $results->rank = $rank->rank."th";
                }
            }
        }

        $results->elo = round($results->elo);

        $results->games = $results->wins + $results->loses;
        if($results->games == 0) {
            $results->games_won_percent = 0;
        } else {
            $results->games_won_percent = round(($results->wins/$results->games)*100);
        }

        $results->total_competitors = $totalCompetitors;
        return $results;
    }
}


