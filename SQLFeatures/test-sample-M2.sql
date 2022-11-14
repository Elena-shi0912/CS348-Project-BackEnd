-- insert 2 users to user table
INSERT INTO User values('y345shi@uwaterloo.ca', 'password', 0);
INSERT INTO UserProfile values('y345shi@uwaterloo.ca', 'Elena', 5483337498)
INSERT INTO User values('kwshi@uwaterloo.ca', 'password1', 1);
INSERT INTO UserProfile values('kwshi@uwaterloo.ca', 'Kai', 5421097498)

-- filter pick up location
SELECT * FROM posting WHERE pickup_location='Waterloo';

-- sort posts bases on price
SELECT * FROM posting
ORDER BY price_per_seat;

-- update seat available
UPDATE posting SET available_seats = available_seats - 1
WHERE post_id = '2fd264f0-4f56-11ed-bdc3-0242ac120002';

-- Driver can craete and view his/her own posts
SELECT * FROM ProvideCarpool pc, Posting p 
WHERE pc.email = 'wangkai920601@gmail.com' and
      pc.posting_id = p.posting_id;

INSERT INTO ProvideCarpool values('wangkai920601@gmail.com', '6fa010ea-6398-11ed-81ce-0242ac120002');
INSERT INTO Posting values ('6fa010ea-6398-11ed-81ce-0242ac120002', 'Waterloo', 'Toronto',
                            '2022-11-14 13:33:01', 4, 20, 'Pets are not allowed');

-- User can make an reservation => trigger: decrease seats available in corresponding posting by 1
CREATE TRIGGER AFTER INSERT ON Reservation
REFERENCING NEW ROW AS r
FOR EACH ROW
UPDATE posting p SET p.available_seats = p.available_seats - 1  WHERE r.posting_id = p.post_id;

INSERT INTO Reservation values('d68e9816-6399-11ed-81ce-0242ac120002', 
                               '6fa010ea-6398-11ed-81ce-0242ac120002' ,
                               'y345shi@uwaterloo.ca');

-- User can cancel his/her reservation => trigger: increase seats available in corresponding posting by 1
CREATE TRIGGER AFTER DELETE ON Reservation
REFERENCING NEW ROW AS r
FOR EACH ROW
UPDATE posting p SET p.available_seats = p.available_seats + 1  WHERE r.posting_id = p.post_id;

DELETE FROM Reservation WHERE reservation_id = 'd68e9816-6399-11ed-81ce-0242ac120002';
