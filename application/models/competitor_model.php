<?php
class Competitor_model extends CI_Model {
	public function __construct()
	{
		$this->load->database();
        $this->load->model('competition_model');
	}

    public function ensure_competitor_id_exists($competitor_id, $competition_id) {
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

        $competition_data = $this->competition_model->get_competition($competition_id);
        if($competition_data['parent']) {
            $this->ensure_competitor_id_exists($competitor_id, $competition_data['parent']);
        }
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

        $this->ensure_competitor_id_exists($competitor_id, $competition_id);
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


        $whereClause = "where competitor_elo.competition_id = {$competition_id}
            and competitor_elo.status = 'active'
            and competitor.status = 'active'";
        if ($id !== FALSE) {
            $whereClause .= " and competitor.id = {$id}";
        }

        $query = $this->db->query("select competitor.challonge_username,
            competitor.email,
            competitor_elo.competitor_id,
            competitor_elo.elo,
            competitor_elo.pseudonym,
            competitor.name,
            maxgame.last_played
            from competitor
            join competitor_elo on competitor.id = competitor_elo.competitor_id
            left join (
                SELECT MAX(game.date) as last_played, score.competitor_id
                FROM game JOIN score ON game.id = score.game_id
                WHERE game.competition_id = {$competition_id}
                GROUP BY score.competitor_id
            ) AS maxgame ON maxgame.competitor_id = competitor.id
            ".$whereClause."
            group by competitor.id
            order by competitor_elo.elo desc, competitor.name asc");


		$results = $query->result();

		//apply rankings
		if ($id === FALSE) {
            $rank = 1;
            $activeRank = 1;
			foreach ($results as $competitor) {
				$competitor->rank = $rank;
                $competitor->activeRank = FALSE;
				$rank++;
                if (strtotime($competitor->last_played) > strtotime('-1 week')) {
                    $competitor->activeRank = $activeRank;
                    $activeRank++;
                }
			}
		}

		return $results;
	}

    public function get_competitor_simple_stats($competition_id,$id = FALSE) {
        if($competition_id == FALSE || $id == FALSE){
            return;
        }
        /*$this->db->select('competitor_elo.competitor_id, competitor_elo.elo ,competitor.name,
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

        $query = $this->db->get();*/

       	$query = $this->db->query("
       	select elo, sum(win_num) wins, sum(loss_num) loses from
(select case when acs.competitor_id_1 = $id then competitor_1_wins else competitor_2_wins end win_num,
			case when acs.competitor_id_1 = $id then competitor_2_wins else competitor_1_wins end loss_num,
			case when acs.competitor_id_1 = $id then c2.name else c1.name end opponent_name
			from agg_competitor_stats acs
				join competitor c1 on c1.id = acs.competitor_id_1
				join competitor c2 on c2.id = acs.competitor_id_2
			where acs.competition_id = $competition_id
				and (acs.competitor_id_1 = $id
					or acs.competitor_id_2 = $id)
        and (acs.competitor_1_wins > 0 or acs.competitor_2_wins > 0)) as t, competitor_elo ce
        where ce.competition_id = $competition_id and ce.competitor_id = $id;");

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


