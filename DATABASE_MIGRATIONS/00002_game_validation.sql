use rivl_dev;

CREATE TABLE IF NOT EXISTS `game_verification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `game_id` BIGINT NOT NULL,
  `competitor_id` BIGINT NOT NULL,
  `status` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

ALTER TABLE game ADD COLUMN `status` VARCHAR(20);