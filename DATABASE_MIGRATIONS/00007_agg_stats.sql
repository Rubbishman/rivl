use rivl_dev;

CREATE TABLE IF NOT EXISTS `agg_competitor_stats` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `competition_id` bigint(20) NOT NULL,
  `competitor_id_1` bigint(20),
  `competitor_id_2` bigint(20),
  `competitor_1_wins` int(20),
  `competitor_2_wins` int(20),
  `competitor_1_streak` int(20),
  `competitor_2_streak` int(20),
  `current_streak` int(20),
  `current_streak_competitor` tinyint,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

insert into agg_competitor_stats (competition_id, competitor_id_1, competitor_id_2, competitor_1_wins, competitor_2_wins, competitor_1_streak, competitor_2_streak, current_streak, current_streak_competitor)
    select comp.id, c1.competitor_id, c2.competitor_id, 0, 0, 0, 0, 0, 0 from competition comp 
        join competitor_elo c1 on comp.id = c1.competition_id
        join competitor_elo c2 on c1.competitor_id != c2.competitor_id and c1.competitor_id < c2.competitor_id and c2.competition_id = c1.competition_id;