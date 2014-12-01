use rivl_dev;

ALTER TABLE `agg_competitor_stats` add column recent_games VARCHAR(500) DEFAULT '[]';
ALTER TABLE `agg_competitor_stats` add column recent_competitor_1_wins INT(20) DEFAULT 0;
ALTER TABLE `agg_competitor_stats` add column recent_competitor_2_wins INT(20) DEFAULT 0;