use rivl_dev;

ALTER TABLE  `competition` ADD  `points` INT NOT NULL ;

UPDATE competition set points = 11 where id = 2;
UPDATE competition set points = 10 where id = 1;