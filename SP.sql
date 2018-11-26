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


-- Like post


-- VIEWS ----------


-- Show feed ------------ IMPORTANT

DELIMITER $$

DROP PROCEDURE IF EXISTS `securityDB`.`showFeed` $$
CREATE PROCEDURE `securityDB`.`showFeed` ()
BEGIN
	SELECT `name`, `caption`, `link`, `postDate`
	FROM `securityDB`.`user`, `securityDB`.`post`
    WHERE `userID`=`user`.`ID`;

END $$
DELIMITER ;



-- OTHER ----------

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
