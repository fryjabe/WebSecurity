-- mysql -u root -p -h localhost

CREATE DATABASE IF NOT EXISTS securityDB DEFAULT CHARACTER SET utf8mb4 ;
USE `securityDB`;

CREATE USER IF NOT EXISTS 'securityAdmin'@'localhost'  IDENTIFIED BY 'strongPassword';
GRANT ALL PRIVILEGES ON `securityDB`.* TO 'securityAdmin'@'localhost';


DROP TABLE IF EXISTS `securityDB`.`like`;
DROP TABLE IF EXISTS `securityDB`.`post`;
DROP TABLE IF EXISTS `securityDB`.`user`;

-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `securityDB`.`user`(

  `ID` INT UNSIGNED NOT NULL AUTO_INCREMENT,

  `name` VARCHAR(91) NOT NULL,

  `email` VARCHAR(60) NOT NULL UNIQUE,
  `pass` VARCHAR(60) NOT NULL,

  `account_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `last_login` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  `role` TINYINT DEFAULT 0,
  `verified` BOOLEAN DEFAULT 0,
  `verificationCode` VARCHAR(64) NOT NULL UNIQUE,


  PRIMARY KEY(`ID`)
);


-- ------------------------------------------------------------------------


CREATE TABLE IF NOT EXISTS `securityDB`.`post`(

`ID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
`userID` INT UNSIGNED NOT NULL,

`caption` VARCHAR(255),
`link` VARCHAR(255),

`postDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`postType` SMALLINT,

`hidden` BOOLEAN DEFAULT 0,

PRIMARY KEY(`ID`),
FOREIGN KEY(`userID`) REFERENCES `securityDB`.`user`(`ID`)

);


-- ------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `securityDB`.`like`(

  `postID` INT UNSIGNED NOT NULL,
  `userID` INT UNSIGNED NOT NULL,

  PRIMARY KEY(`postID`, `userID`),
  FOREIGN KEY(`userID`) REFERENCES `securityDB`.`user`(`ID`),
  FOREIGN KEY(`postID`) REFERENCES `securityDB`.`post`(`ID`)
);
