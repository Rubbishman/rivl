use rivl_dev;

ALTER TABLE `competitor` add column challonge_username VARCHAR(40) DEFAULT null;
UPDATE competitor SET challonge_username =  'liamjohnston' WHERE name =  'Liam';
UPDATE competitor SET challonge_username =  'Rubbishman' WHERE name =  'Jonathan';
UPDATE competitor SET challonge_username =  'killerdim' WHERE name =  'Dmitri';
UPDATE competitor SET challonge_username =  'gatward' WHERE name =  'Darryl';
UPDATE competitor SET challonge_username =  'super_liverbird' WHERE name =  'Rob';
UPDATE competitor SET challonge_username =  'sincl4ir' WHERE name =  'Paul S';
UPDATE competitor SET challonge_username =  'simonkplusplus' WHERE name =  'Simon';
UPDATE competitor SET challonge_username =  'insanewookie' WHERE name =  'Rowan';
UPDATE competitor SET challonge_username =  'deanoemcke' WHERE name =  'Dean';
UPDATE competitor SET challonge_username =  'dpz' WHERE name =  'Dave';
UPDATE competitor SET challonge_username =  'todddd' WHERE name =  'Todd';
UPDATE competitor SET challonge_username =  'nzjay' WHERE name =  'Jason';
UPDATE competitor SET challonge_username =  'georgecooke' WHERE name =  'George';