CREATE DATABASE IF NOT EXISTS `carpool`;
USE `carpool`;

CREATE TABLE IF NOT EXISTS `User` (
  `email` varchar(40) NOT NULL,
  `password` varchar(40) NOT NULL,
  `isDriver` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `UserProfile` (
  `email` varchar(40) NOT NULL REFERENCES `User` (`email`),
  `user_name` varchar(45) NOT NULL,
  `phone_number` decimal(10,0) NOT NULL,
  PRIMARY KEY (`email`),
  UNIQUE KEY `user_name_UNIQUE` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `DriverProfile` (
  `email` varchar(40) NOT NULL REFERENCES `User` (`email`),
  `user_name` varchar(45) NOT NULL,
  `phone_number` decimal(10,0) NOT NULL,
  `rating` decimal(2,1) NOT NULL DEFAULT '0.0',
  PRIMARY KEY (`email`),
  UNIQUE KEY `user_name_UNIQUE` (`user_name`),
  CONSTRAINT `driverprofile_chk_1` CHECK (((`rating` <= 5) and (`rating` >= 0)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `Posting` (
  `post_id` varchar(36) NOT NULL REFERENCES `ProvideCarpool` (`post_id`),
  `pickup_location` varchar(45) NOT NULL,
  `dropoff_location` varchar(45) NOT NULL,
  `pickup_time` datetime NOT NULL,
  `available_seats` varchar(45) NOT NULL DEFAULT '4',
  `price_per_seat` int NOT NULL,
  `additional_info` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `ProvideCarpool` (
  `email` varchar(40) NOT NULL REFERENCES `DriverProfile` (`email`),
  `post_id` varchar(36) NOT NULL,
  PRIMARY KEY (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `Reservation` (
  `reservation_id` varchar(36) NOT NULL,
  `posting_id` varchar(36) NOT NULL REFERENCES `Posting` (`post_id`),
  `user_email` varchar(45) NOT NULL REFERENCES `UserProfile` (`email`) ON DELETE CASCADE,
  PRIMARY KEY (`reservation_id`),
  KEY `post_id_idx` (`posting_id`),
  KEY `email_idx` (`user_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `Review` (
  `reservation_id` varchar(36) NOT NULL REFERENCES `Reservation` (`reservation_id`),
  `driver_email` varchar(45) NOT NULL REFERENCES `DriverProfile` (`email`),
  `rating` decimal(1,0) NOT NULL DEFAULT '5',
  `comment` varchar(150) DEFAULT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`reservation_id`),
  KEY `email_idx` (`driver_email`),
  KEY `email_index` (`driver_email`),
  CONSTRAINT `review_chk_1` CHECK (((`rating` <= 5) and (`rating` >= 0)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE DEFINER = CURRENT_USER TRIGGER `carpool`.`Review_AFTER_INSERT` AFTER INSERT ON `Review` 
FOR EACH ROW
	UPDATE DriverProfile
    SET rating = (
		SELECT AVG(rating)
        FROM Review
        WHERE driver_email = DriverProfile.email
        GROUP BY driver_email
    )
    WHERE NEW.driver_email = email;

-- NOTE: these 2 triggers should be run AFTER production data is loaded into the table

CREATE DEFINER = CURRENT_USER TRIGGER `carpool`.`Reservation_AFTER_INSERT` AFTER INSERT ON `Reservation`
FOR EACH ROW
UPDATE Posting SET available_seats = available_seats - 1  WHERE NEW.posting_id = post_id;

CREATE DEFINER = CURRENT_USER TRIGGER `carpool`.`Reservation_AFTER_DELETE` AFTER DELETE ON `Reservation`
FOR EACH ROW
UPDATE Posting SET available_seats = available_seats + 1  WHERE OLD.posting_id = post_id;
