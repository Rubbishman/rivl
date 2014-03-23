use rivl_dev;

CREATE TABLE IF NOT EXISTS `note` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `note` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `note_attachment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `object_type` VARCHAR(20),
  `object_id` BIGINT(20),
  `note_id` BIGINT(20),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `activity` (
	`id` BIGINT, 
	`competition_id` BIGINT, 
	`title` VARCHAR(30),
	`thumbnail` VARCHAR(200),
	`url` VARCHAR(200),
	`summary` VARCHAR(500), 
	`description` TEXT, 
	`step_size` INT,
	PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;
	
CREATE TABLE IF NOT EXISTS `activity_stats` (
	`id` BIGINT, 
	`drill_id` BIGINT, 
	`competitor_id` BIGINT, 
	`created` DATETIME, 
	`score` INT,
	`goal` INT,
	PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

ALTER TABLE `competitor_elo` add column status VARCHAR(20) DEFAULT 'active';
ALTER TABLE `competitor_elo` add column pseudonym VARCHAR(40) DEFAULT null;