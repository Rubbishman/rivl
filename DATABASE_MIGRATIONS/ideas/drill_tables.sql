CREATE TABLE drill (
	id BIGINT, 
	competition_id BIGINT, 
	title VARCHAR(30),
	thumbnail VARCHAR(100),
	url VARCHAR(100),
	summary VARCHAR(255), 
	description TEXT, 
	step_size INT,
	PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
	
CREATE TABLE drill_stats (
	id BIGINT, 
	drill_id BIGINT, 
	competitor_id BIGINT, 
	created TIMESTAMP, 
	score INT,
	goal INT,
	PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
