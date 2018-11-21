USE `securityDB`;

-- ACTIONS --------

-- Create user -------- IMPORTANT

DELIMITER $$

DROP PROCEDURE IF EXISTS `securityDB`.`createUser` $$
CREATE PROCEDURE `securityDB`.`createUser` (IN `userNameIn` VARCHAR(45),
                                            IN `emailIn` VARCHAR(60), IN `passIn` VARCHAR(60),
                                            IN `verificationCodeIn` VARCHAR(64))
BEGIN
	INSERT INTO `securityDB`.`user`(`name`, `email`, `pass`, `verificationCode`) VALUES
			            (`userNameIn`, `emailIn`, `passIn`, `verificationCodeIn`);
END $$
DELIMITER ;

-- Post --------- IMPORTANT

DELIMITER $$

DROP PROCEDURE IF EXISTS `securityDB`.`createPost` $$
CREATE PROCEDURE `securityDB`.`createPost` (IN `userIDIn` INT UNSIGNED, IN `captionIn` VARCHAR(255),
                                            `linkIn` VARCHAR(255), IN `postTypeIn` SMALLINT)
BEGIN
	INSERT INTO `securityDB`.`post`(`userID`, `caption`, `link`, `postType`) VALUES
			            (`userIDIn`, `captionIn`, `linkIn`, `postTypeIn`);
END $$
DELIMITER ;

-- Message

-- Request friend ---------- IMPORTANT



-- Accept friend ---------- IMPORTANT


-- Decline friend

-- Block friend

-- Like post

-- Comment post


-- VIEWS ----------

-- Show friends

-- Show feed ------------ IMPORTANT

DELIMITER $$

DROP PROCEDURE IF EXISTS `securityDB`.`showFeed` $$
CREATE PROCEDURE `securityDB`.`showFeed` (IN `userRequestID` INT UNSIGNED)
BEGIN
	(SELECT `name`, `caption`, `link`, `postDate`
	FROM `securityDB`.`user`, `securityDB`.`post`
	WHERE `userID` = `userRequestID`AND `user`.`ID` = `userID`)
  UNION
  (SELECT `name`, `caption`, `link`, `postDate`
	FROM `securityDB`.`user`, `securityDB`.`friends`, `securityDB`.`post`
	WHERE `status` = 1 AND
	(`userID` = `userAID` AND `userRequestID` = `userBID` OR
	`userID` = `userBID` AND `userRequestID` = `userAID`));

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

DELIMITER ;

-- Find user for register --------- IMPORTANT
DELIMITER $$

DROP PROCEDURE IF EXISTS `securityDB`.`findUserRegister` $$
CREATE PROCEDURE `securityDB`.`findUserRegister` (IN `mailIn` VARCHAR(60))
BEGIN

	SELECT `name`, `ID`, `pass`, `verified`
	FROM `securityDB`.`user`
	WHERE `mailIn` = `email`;

END $$
DELIMITER ;

-- Update last login

DELIMITER $$

DROP PROCEDURE IF EXISTS `securityDB`.`updateLogin` $$
CREATE PROCEDURE `securityDB`.`updateLogin` (IN `mailIn` VARCHAR(60))
BEGIN

  UPDATE `securityDB`.`user`
  SET `last_login` = CURRENT_TIMESTAMP
  WHERE `mailIn` = `email`;

END $$
DELIMITER ;

-- Verify account

DELIMITER $$

DROP PROCEDURE IF EXISTS `securityDB`.`verifyAccount` $$
CREATE PROCEDURE `securityDB`.`verifyAccount` (IN `code` VARCHAR(64))
BEGIN
  UPDATE `securityDB`.`user`
  SET `verified` = 1
  WHERE `verificationCode` = `code`;

END $$
DELIMITER ;


-- Get friend status

-- DELIMITER $$

-- DROP PROCEDURE IF EXISTS `securityDB`.`getFriendStatus` $$
-- CREATE PROCEDURE `securityDB`.`getFriendStatus` (IN `userAIDIn` INT, IN `userBIDIn`)
-- BEGIN
-- 	SELECT `status`, `actionUserID`
--  FROM `securityDB`.`friends`
--  WHERE `userAID` = `userAIDIn` AND `userBID` = `userBIDIn` OR
--        `userAID` = `userBIDIn` AND `userBID` = `userAIDIn`;

-- END $$
-- DELIMITER ;
