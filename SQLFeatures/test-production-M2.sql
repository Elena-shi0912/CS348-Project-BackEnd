-- insert 2 users to user table
INSERT INTO User values('y345shi@uwaterloo.ca', 'password', 0);
INSERT INTO UserProfile values('y345shi@uwaterloo.ca', 'Elena', 5483337498);
INSERT INTO User values('kwshi@uwaterloo.ca', 'password1', 1);
INSERT INTO DriverProfile values('kwshi@uwaterloo.ca', 'Kai', 5421097498);

-- View if account is created successfully
SELECT * FROM User, UserProfile 
WHERE (User.email = 'y345shi@uwaterloo.ca' AND UserProfile.email = 'y345shi@uwaterloo.ca') OR
      (User.email = 'kwshi@uwaterloo.ca' AND UserProfile.email = 'kwshi@uwaterloo.ca');

-- filter pick up location
SELECT * FROM posting WHERE pickup_location='Waterloo';

-- sort posts bases on price
SELECT * FROM posting
ORDER BY price_per_seat;

-- update seat available
UPDATE posting SET available_seats = available_seats - 1
WHERE post_id = '0cf21b45-6d37-4a49-a7e7-33b18557cebc';

-- to view successful update
SELECT * FROM posting where post_id = '0cf21b45-6d37-4a49-a7e7-33b18557cebc';

-- Driver can craete and view his/her own posts
SELECT * FROM ProvideCarpool, Posting
WHERE email = 'xxK@uwaterloo.ca' and
      ProvideCarpool.post_id = Posting.post_id;


INSERT INTO ProvideCarpool values('xxK@uwaterloo.ca', '6fa010ea-6398-11ed-81ce-0242ac120002');
INSERT INTO Posting values ('6fa010ea-6398-11ed-81ce-0242ac120002', 'Waterloo', 'Toronto',
                            '2022-11-14 13:33:01', 4, 20, 'Pets are not allowed');

-- TO test if post is created successfully
SELECT * FROM ProvideCarpool, Posting
WHERE email = 'xxK@uwaterloo.ca' and
      ProvideCarpool.post_id = Posting.post_id;

-- User can make an reservation => trigger: decrease seats available in corresponding posting by 1
-- CREATE DEFINER = CURRENT_USER TRIGGER `carpool`.`Reservation_AFTER_INSERT` AFTER INSERT ON `Reservation`
-- FOR EACH ROW
-- UPDATE Posting SET available_seats = available_seats - 1  WHERE NEW.posting_id = post_id;

INSERT INTO Reservation values('d68e9816-6399-11ed-81ce-0242ac120002', 
                               '6fa010ea-6398-11ed-81ce-0242ac120002' ,
                               'y345shi@uwaterloo.ca');

-- Check if reservation is created successfully and corresponding posting is updated
SELECT * FROM Reservation where user_email = 'y345shi@uwaterloo.ca';
SELECT * FROM Posting WHERE post_id = '6fa010ea-6398-11ed-81ce-0242ac120002';

-- User can cancel his/her reservation => trigger: increase seats available in corresponding posting by 1
-- CREATE DEFINER = CURRENT_USER TRIGGER `carpool`.`Reservation_AFTER_DELETE` AFTER DELETE ON `Reservation`
-- FOR EACH ROW
-- UPDATE Posting SET available_seats = available_seats + 1  WHERE OLD.posting_id = post_id;

DELETE FROM Reservation WHERE reservation_id = 'd68e9816-6399-11ed-81ce-0242ac120002';
-- Check if reservation is cancelled successfully and corresponding posting is updated
SELECT * FROM Reservation where user_email = 'y345shi@uwaterloo.ca';
SELECT * FROM Posting WHERE post_id = '6fa010ea-6398-11ed-81ce-0242ac120002';