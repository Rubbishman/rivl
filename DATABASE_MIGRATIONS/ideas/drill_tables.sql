CREATE TABLE drill (id BIGINT, competition_id BIGINT, summary VARCHAR(255), description TEXT, step_size INT);
CREATE TABLE drill_stats (id BIGINT, drill_id BIGINT, competitor_id BIGINT, created TIMESTAMP, score INT);
