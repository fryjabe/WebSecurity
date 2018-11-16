CREATE DATABASE IF NOT EXISTS securityDB DEFAULT CHARACTER SET utf8mb4 ;
USE `securityDB` ;

DROP TABLE IF EXISTS `securityDB`.`user`;
-- DROP TABLE IF EXISTS `securityDB`.`event`;
DROP TABLE IF EXISTS `securityDB`.`post`;

DROP TABLE IF EXISTS `securityDB`.`message`;

DROP TABLE IF EXISTS `securityDB`.`friends`;
DROP TABLE IF EXISTS `securityDB`.`assistance`;
DROP TABLE IF EXISTS `securityDB`.`like`;
DROP TABLE IF EXISTS `securityDB`.`comment`;

-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `securityDB`.`user`(

  `ID` INT UNSIGNED NOT NULL AUTO_INCREMENT,

  `userName` VARCHAR(45) NOT NULL,
  `userSurname` VARCHAR(45) NOT NULL,

  `email` VARCHAR(60) NOT NULL UNIQUE,
  `birthdate` DATE NOT NULL,
  `pass` VARCHAR(60) NOT NULL,

  `account_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `last_login` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  `role` TINYINT DEFAULT 0,
  `verified` BOOLEAN DEFAULT 0,
  `verificationCode` VARCHAR(64) NOT NULL,


  PRIMARY KEY(`ID`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  UNIQUE INDEX `activationCode_UNIQUE` (`activationCode` ASC))
);

-- ------------------------------------------------------------------------


-- CREATE TABLE IF NOT EXISTS `securityDB`.`event(

--  ID INT UNSIGNED NOT NULL AUTO_INCREMENT,

--  creatorID INT NOT NULL,

--  place VARCHAR(45) NOT NULL,
--  eventDate DATETIME NOT NULL,
--  description VARCHAR(255),

--  PRIMARY KEY(ID)

--)

-- ------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `securityDB`.`message`(

  `ID` INT UNSIGNED NOT NULL AUTO_INCREMENT,

  `senderID` INT NOT NULL,
  `receiverID` INT NOT NULL,

  `content` VARCHAR(255) NOT NULL,
  `msgDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  `hidden` BOOLEAN DEFAULT 0,

  PRIMARY KEY(`ID`)

)

-- ------------------------------------------------------------------------
-- status 0 pending - 1 accepted - 2 declined - 3 blocked

CREATE TABLE IF NOT EXISTS `securityDB`.`friends`(

  `userAID` INT NOT NULL,
  `userBID` INT NOT NULL,

  `status` SMALLINT DEFAULT 0,
  `actionUserID` INT NOT NULL,

  PRIMARY KEY(`userAID`, `userBID`)
  FOREIGN KEY(`userAID`) REFERENCES `securityDB`.`user`(`ID`),
  FOREIGN KEY(`userBID`) REFERENCES `securityDB`.`user`(`ID`),
  FOREIGN KEY(`actionUserID`) REFERENCES `securityDB`.`user`(`ID`),
)

-- ------------------------------------------------------------------------


CREATE TABLE IF NOT EXISTS `securityDB`.`post`(

`ID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
`userID` INT,

`caption` VARCHAR(255),
`link` VARCHAR(255),

`postDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`postType` SMALLINT,

`hidden` BOOLEAN DEFAULT 0,

PRIMARY KEY(`ID`),
FOREIGN KEY(`userID`) REFERENCES `securityDB`.`user`(`ID`)

)

-- ------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `securityDB`.`assistance`(

  `eventID` INT NOT NULL,
  `userID` INT NOT NULL,

  PRIMARY KEY(`eventID`, `userID`),
  FOREIGN KEY(`userID`) REFERENCES `securityDB`.`user`(`ID`),
  FOREIGN KEY(`eventID`) REFERENCES `securityDB`.`event`(`ID`)
)

--------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `securityDB`.`like`(

  `postID` INT NOT NULL,
  `userID` INT NOT NULL,

  PRIMARY KEY(`postID`, `userID`),
  FOREIGN KEY(`userID`) REFERENCES `securityDB`.`user`(`ID`),
  FOREIGN KEY(`postID`) REFERENCES `securityDB`.`post`(`ID`)
)

--------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `securityDB`.`comment`(

  `postID` INT NOT NULL,
  `userID` INT NOT NULL,

  `content` VARCHAR(255) NOT NULL,

  PRIMARY KEY(`postID`, `userID`),
  FOREIGN KEY(`userID`) REFERENCES `securityDB`.`user`(`ID`),
  FOREIGN KEY(`postID`) REFERENCES `securityDB`.`post`(`ID`)
)


-- ------------------------------------------------------------------------
-- STORED PROCEDURES -----------------------------------------------------

-- ACTIONS --------

-- Create user -------- IMPORTANT

DELIMITER $$

DROP PROCEDURE IF EXISTS `securityDB`.`createUser` $$
CREATE PROCEDURE `securityDB`.`createUser` (IN `userNameIn` VARCHAR(45), IN `userSurnameIn` VARCHAR(45),
                                        IN `emailIn` VARCHAR(60), IN `birthdateIn` DATE,
		                                    IN `passIn` VARCHAR(60), IN `verificationCodeIn` VARCHAR(64))
BEGIN
	INSERT INTO `securityDB`.`user`(`userName`, `userSurname`, `email`, `birthdate`, `pass`, `verificationCode`) VALUES
			            (`userNameIn`, `userSurnameIn`, `emailIn`, `birthdateIn`, `passIn`, `verificationCodeIn`);
END $$
DELIMITER ;

-- Create event

-- Post --------- IMPORTANT

DELIMITER $$

DROP PROCEDURE IF EXISTS `securityDB`.`createPost` $$
CREATE PROCEDURE `securityDB`.`createPost` (IN `userIDIn` INT, IN `captionIn` VARCHAR(255),
                                            `linkIn` VARCHAR(255), IN `postTypeIn` SMALLINT)
BEGIN
	INSERT INTO `securityDB`.`post`(`userID`, `caption`, `link`, `postType`) VALUES
			            (`userIDIn`, `captionIn`, `emailIn`, `postTypeIn`);
END $$
DELIMITER ;

-- Message

-- Request friend ---------- IMPORTANT



-- Accept friend ---------- IMPORTANT


-- Decline friend

-- Block friend

-- Assist event

-- Like post

-- Comment post


-- VIEWS ----------

-- Show friends

-- Show feed ------------ IMPORTANT

DELIMITER $$

DROP PROCEDURE IF EXISTS `securityDB`.`showFeed` $$
CREATE PROCEDURE `securityDB`.`showFeed` (IN `userRequestID` INT)
BEGIN
	SELECT `userName`, `userSurname`, `caption`, `link`
  FROM `securityDB`.`user`, `securityDB`.`friends`, `securityDB`.`post`
  WHERE
  `userID` = `userRequestID` OR
  `status` = 1 AND
  (`userID` = `userAID` AND `userRequestID` = `userBID` OR
   `userID` = `userBID` AND `userRequestID` = `userAID`);

END $$
DELIMITER ;

-- Show friend's posts

-- Show comments on a friend post

-- Show conversation

-- Search person


-- OTHER ----------

-- Find user for login ------------ IMPORTANT
DELIMITER $$

DROP PROCEDURE IF EXISTS `securityDB`.`findUserLogin` $$
CREATE PROCEDURE `securityDB`.`findUserLogin` (IN `mailIn` INT)
BEGIN

  UPDATE `user`
  SET `last_login` = CURRENT_TIMESTAMP
  WHERE `mailIn` = `email`;

	SELECT `userName`, `userSurname`, `userID`, `pass`
  FROM `securityDB`.`user`
  WHERE `mailIn` = `email` AND `verified` = 1;

END $$
DELIMITER ;

-- Find user for register --------- IMPORTANT
DELIMITER $$

DROP PROCEDURE IF EXISTS `securityDB`.`findUserRegister` $$
CREATE PROCEDURE `securityDB`.`findUserRegister` (IN `mailIn` INT)
BEGIN

	SELECT `userName`, `userSurname`, `userID`, `pass`
  FROM `securityDB`.`user`
  WHERE `mailIn` = `email`;

END $$
DELIMITER ;

-- Update last login

DELIMITER $$

DROP PROCEDURE IF EXISTS `securityDB`.`updateLogin` $$
CREATE PROCEDURE `securityDB`.`updateLogin` (IN `mailIn` INT)
BEGIN

  UPDATE `user`
  SET `last_login` = CURRENT_TIMESTAMP
  WHERE `mailIn` = `email`;

END $$
DELIMITER ;

-- Verify account

DELIMITER $$

DROP PROCEDURE IF EXISTS `securityDB`.`verifyAccount` $$
CREATE PROCEDURE securityDB.verifyAccount (IN code VARCHAR(64))
BEGIN
  UPDATE `user`
  SET `verified` = 1
  WHERE `verificationCode` = `code`;

END $$
DELIMITER ;


-- Get friend status

DELIMITER $$

DROP PROCEDURE IF EXISTS `securityDB`.`getFriendStatus` $$
CREATE PROCEDURE `securityDB`.`getFriendStatus` (IN `userAIDIn` INT, IN `userBIDIn`)
BEGIN
	SELECT `status`, `actionUserID`
  FROM `securityDB`.`friends`
  WHERE `userAID` = `userAIDIn` AND `userBID` = `userBIDIn` OR
        `userAID` = `userBIDIn` AND `userBID` = `userAIDIn`;

END $$
DELIMITER ;


-- Check friend assisting event
