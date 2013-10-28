use rivl_dev;

CREATE TABLE IF NOT EXISTS `title` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `competition_id` bigint(20) NOT NULL,
  `current_competitor_id` bigint(20),
  `title` VARCHAR(30) NOT NULL,
  `description` VARCHAR(300) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;