CREATE TABLE drill (id BIGINT, competition_id BIGINT, title VARCHAR(100), summary VARCHAR(555), instructions TEXT, external_link VARCHAR(200), step_size INT);
CREATE TABLE drill_stats (id BIGINT, drill_id BIGINT, competitor_id BIGINT, created TIMESTAMP, score INT);
