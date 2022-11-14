LOAD DATA LOCAL INFILE '/Users/syy/Desktop/CS348_Project/Sample_Data_M2/User.csv'
INTO TABLE carpool.User FIELDS TERMINATED BY ','
ENCLOSED BY '"' LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '/Users/syy/Desktop/CS348_Project/Sample_Data_M2/UserProfile.csv'
INTO TABLE carpool.UserProfile FIELDS TERMINATED BY ','
ENCLOSED BY '"' LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '/Users/syy/Desktop/CS348_Project/Sample_Data_M2/DriverProfile.csv'
INTO TABLE carpool.DriverProfile FIELDS TERMINATED BY ','
ENCLOSED BY '"' LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '/Users/syy/Desktop/CS348_Project/Sample_Data_M2/ProvideCarpool.csv'
INTO TABLE carpool.ProvideCarpool FIELDS TERMINATED BY ','
ENCLOSED BY '"' LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '/Users/syy/Desktop/CS348_Project/Sample_Data_M2/Posting.csv'
INTO TABLE carpool.Posting FIELDS TERMINATED BY ','
ENCLOSED BY '"' LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '/Users/syy/Desktop/CS348_Project/Sample_Data_M2/Reservation.csv'
INTO TABLE carpool.Reservation FIELDS TERMINATED BY ','
ENCLOSED BY '"' LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '/Users/syy/Desktop/CS348_Project/Sample_Data_M2/Review.csv'
INTO TABLE carpool.Review FIELDS TERMINATED BY ','
ENCLOSED BY '"' LINES TERMINATED BY '\n';
