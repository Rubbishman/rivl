use rivl_dev;

CREATE TABLE IF NOT EXISTS `score_details` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `score_id` bigint(20) NOT NULL,
  `detail_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

DROP TABLE `game_details`;
