<?php
if(!function_exists('elo_helper')) {
	function elo_helper($elo_winner,$elo_loser, $winner_games, $loser_games){
		$winner_chance = 1/(1 + pow(10,(($elo_loser - $elo_winner)/400)));
		$loser_chance = 1/(1 + pow(10,(($elo_winner - $elo_loser)/400)));

        $win_k_val = 32;
        $lose_k_val = 32;
        if($winner_games < 64) {
            $win_k_val = 96 - (64*($winner_games/64));
        }

        if($loser_games < 64) {
            $lose_k_val = 96 - (64*($loser_games/64));
        }

		$results = array(
			'winner_elo' => ($elo_winner + $win_k_val*(1-$winner_chance)),
			'loser_elo' => ($elo_loser + $lose_k_val*(0-$loser_chance)));
		return $results;
	}
}
/*
 Ea = 1/(1 + 10 ^ ((Rb-Ra) / 400) )
Eb = 1/(1 + 10 ^ ((Ra-Rb) / 400) )
Ex is the expected probability that X will win the match. Ea + Eb = 1. Rx is the rating of X, which changes after every match, according to the formula:
Rx = Rx(old) + 32 * ( W – Ex ) where W=1 if X wins and W=0 if X loses.
 */
