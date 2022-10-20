# insert 2 users to user table
INSERT INTO user values(uuid(), 'user1', 'password', 1234567890, 'user1@gmail.com');
INSERT INTO user values(uuid(), 'user2', 'password', 1234567890, 'user2@gmail.com');

# filter pick up location
SELECT * FROM posting WHERE pickup_location='Waterloo';

# sort posts bases on price
SELECT * FROM posting
ORDER BY price_per_seat;

# update seat available
UPDATE posting SET seats_available = seats_available - 1
WHERE post_id = '2fd264f0-4f56-11ed-bdc3-0242ac120002';