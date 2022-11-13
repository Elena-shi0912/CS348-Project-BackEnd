CREATE DATABASE IF NOT EXISTS `test`;
USE `test`;

CREATE TABLE IF NOT EXISTS `User` (
  `email` varchar(40) NOT NULL,
  `password` varchar(40) NOT NULL,
  `isDriver` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `UserProfile` (
  `email` varchar(40) NOT NULL,
  `user_name` varchar(45) NOT NULL,
  `phone_number` decimal(10,0) NOT NULL,
  PRIMARY KEY (`email`),
  UNIQUE KEY `user_name_UNIQUE` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `DriverProfile` (
  `email` varchar(40) NOT NULL,
  `user_name` varchar(45) NOT NULL,
  `phone_number` decimal(10,0) NOT NULL,
  `rating` decimal(1,1) NOT NULL DEFAULT '0.0',
  PRIMARY KEY (`email`),
  UNIQUE KEY `user_name_UNIQUE` (`user_name`),
  CONSTRAINT `driverprofile_chk_1` CHECK (((`rating` <= 5) and (`rating` >= 0)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `Posting` (
  `post_id` varchar(36) NOT NULL,
  `pickup_location` varchar(45) NOT NULL,
  `dropoff_location` varchar(45) NOT NULL,
  `pickup_time` datetime NOT NULL,
  `available_seats` varchar(45) NOT NULL DEFAULT '4',
  `price_per_seat` int NOT NULL,
  `additional_info` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `ProvideCarpool` (
  `email` int NOT NULL,
  `post_id` varchar(45) NOT NULL,
  PRIMARY KEY (`post_id`),
  CONSTRAINT `post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `Posting` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `Reservation` (
  `reservation_id` varchar(36) NOT NULL,
  `posting_id` varchar(36) NOT NULL,
  `user_email` varchar(45) NOT NULL,
  PRIMARY KEY (`reservation_id`),
  KEY `post_id_idx` (`posting_id`),
  KEY `email_idx` (`user_email`),
  CONSTRAINT `email` FOREIGN KEY (`user_email`) REFERENCES `UserProfile` (`email`) ON DELETE CASCADE,
  CONSTRAINT `post_id` FOREIGN KEY (`posting_id`) REFERENCES `Posting` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `Review` (
  `reservation_id` varchar(36) NOT NULL,
  `driver_email` varchar(45) NOT NULL,
  `rating` decimal(1,0) NOT NULL DEFAULT '5',
  `comment` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`reservation_id`),
  KEY `email_idx` (`driver_email`),
  KEY `email_index` (`driver_email`),
  CONSTRAINT `driver_email_fkey` FOREIGN KEY (`driver_email`) REFERENCES `DriverProfile` (`email`),
  CONSTRAINT `reservarion_id_fkey` FOREIGN KEY (`reservation_id`) REFERENCES `Reservation` (`reservation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE DEFINER = CURRENT_USER TRIGGER `test`.`Review_AFTER_INSERT` AFTER INSERT ON `Review` FOR EACH ROW
BEGIN
	UPDATE DriverProfile
    SET rating = (
		SELECT AVG(rating)
        FROM Review
        GROUP BY driver_email
        HAVING driver_email = email
    )
END;

