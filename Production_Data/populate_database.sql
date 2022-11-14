LOAD DATA LOCAL INFILE '/Users/kldxbjz/Documents/test/user.csv'
INTO TABLE test.User FIELDS TERMINATED BY ','
ENCLOSED BY '"' LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '/Users/kldxbjz/Documents/test/user_profile.csv'
INTO TABLE test.UserProfile FIELDS TERMINATED BY ','
ENCLOSED BY '"' LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '/Users/kldxbjz/Documents/test/driver_profile.csv'
INTO TABLE test.DriverProfile FIELDS TERMINATED BY ','
ENCLOSED BY '"' LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '/Users/kldxbjz/Documents/test/provide_carpool.csv'
INTO TABLE test.ProvideCarpool FIELDS TERMINATED BY ','
ENCLOSED BY '"' LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '/Users/kldxbjz/Documents/test/posting.csv'
INTO TABLE test.Posting FIELDS TERMINATED BY ','
ENCLOSED BY '"' LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '/Users/kldxbjz/Documents/test/ride.csv'
INTO TABLE test.Reservation FIELDS TERMINATED BY ','
ENCLOSED BY '"' LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '/Users/kldxbjz/Documents/test/review.csv'
INTO TABLE test.Review FIELDS TERMINATED BY ','
ENCLOSED BY '"' LINES TERMINATED BY '\n';


