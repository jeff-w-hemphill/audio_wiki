CREATE USER docker;
GRANT ALL PRIVILEGES ON DATABASE audio_wiki TO docker;
CREATE TABLE IF NOT EXISTS reviews (
  artist VARCHAR(255),    
  review TEXT NOT NULL,  
  review_date DATE
);

INSERT INTO reviews(artist, review, review_date) 
VALUES ('Red Hot Chili Peppers', 'They are awesome!', '2021-12-08'),
       ('Pink Floyd', 'Best psychedlic band!', '2021-12-08');