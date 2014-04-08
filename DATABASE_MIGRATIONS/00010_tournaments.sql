use rivl_dev;

CREATE TABLE IF NOT EXISTS `tournament` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `competition_id` bigint(20) NOT NULL,
  `challonge_id` bigint(20) NOT NULL,
  `name` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

INSERT INTO `tournament`(`competition_id`, `challonge_id`, `name`) VALUES (3,767883,'Arcade Action');
INSERT INTO `tournament`(`competition_id`, `challonge_id`, `name`) VALUES (3,832842,'The Arcade Strikes Back');
INSERT INTO `tournament`(`competition_id`, `challonge_id`, `name`) VALUES (3,894159,'Return of the Arcade');