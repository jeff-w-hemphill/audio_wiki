DROP TABLE IF EXISTS reviews CASCADE;
CREATE TABLE IF NOT EXISTS reviews (
  artist VARCHAR(255),    
  review TEXT NOT NULL,  
  review_date DATE,
);