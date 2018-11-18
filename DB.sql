CREATE DATABASE IF NOT EXISTS securityDB DEFAULT CHARACTER SET utf8mb4 ;
USE `securityDB`;

DROP TABLE IF EXISTS `securityDB`.`friends`;
DROP TABLE IF EXISTS `securityDB`.`like`;
DROP TABLE IF EXISTS `securityDB`.`comment`;

DROP TABLE IF EXISTS `securityDB`.`message`;

DROP TABLE IF EXISTS `securityDB`.`post`;
DROP TABLE IF EXISTS `securityDB`.`user`;

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
  `verificationCode` VARCHAR(64) NOT NULL UNIQUE,


  PRIMARY KEY(`ID`)
);

-- -------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `securityDB`.`message`(

  `ID` INT UNSIGNED NOT NULL AUTO_INCREMENT,

  `senderID` INT UNSIGNED NOT NULL,
  `receiverID` INT UNSIGNED NOT NULL,

  `content` VARCHAR(255) NOT NULL,
  `msgDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  `hidden` BOOLEAN DEFAULT 0,

  PRIMARY KEY(`ID`),
  FOREIGN KEY(`senderID`) REFERENCES `securityDB`.`user`(`ID`),
  FOREIGN KEY(`receiverID`) REFERENCES `securityDB`.`user`(`ID`)

);

-- ------------------------------------------------------------------------
-- status 0 pending - 1 accepted - 2 declined - 3 blocked

CREATE TABLE IF NOT EXISTS `securityDB`.`friends`(

  `userAID` INT UNSIGNED NOT NULL,
  `userBID` INT UNSIGNED NOT NULL,

  `status` SMALLINT DEFAULT 0,
  `actionUserID` INT UNSIGNED NOT NULL,

  PRIMARY KEY(`userAID`, `userBID`),
  FOREIGN KEY(`userAID`) REFERENCES `securityDB`.`user`(`ID`),
  FOREIGN KEY(`userBID`) REFERENCES `securityDB`.`user`(`ID`),
  FOREIGN KEY(`actionUserID`) REFERENCES `securityDB`.`user`(`ID`)
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

-- ------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `securityDB`.`comment`(

  `postID` INT UNSIGNED NOT NULL,
  `userID` INT UNSIGNED NOT NULL,

  `content` VARCHAR(255) NOT NULL,

  PRIMARY KEY(`postID`, `userID`),
  FOREIGN KEY(`userID`) REFERENCES `securityDB`.`user`(`ID`),
  FOREIGN KEY(`postID`) REFERENCES `securityDB`.`post`(`ID`)
);
