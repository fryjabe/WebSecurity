CREATE DATABASE IF NOT EXISTS securityDB DEFAULT CHARACTER SET utf8mb4 ;
USE securityDB ;

DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS event;
DROP TABLE IF EXISTS post;

DROP TABLE IF EXISTS message;

DROP TABLE IF EXISTS request;
DROP TABLE IF EXISTS assistance;
DROP TABLE IF EXISTS like;
DROP TABLE IF EXISTS comment;


USE securityDB;

--------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user(

ID INT UNSIGNED NOT NULL AUTO_INCREMENT,

userName VARCHAR(45) NOT NULL,
userSurname VARCHAR(45) NOT NULL,

email VARCHAR(60) NOT NULL UNIQUE,
birthdate DATE NOT NULL,
pass VARCHAR(60) NOT NULL,

role TINYINT DEFAULT 0,
verified BOOLEAN DEFAULT 0,
verificationCode VARCHAR(64) NOT NULL,


PRIMARY KEY(ID)
);

--------------------------------------------------------------------------


CREATE TABLE IF NOT EXISTS event(

  ID INT UNSIGNED NOT NULL AUTO_INCREMENT,

  creatorID INT NOT NULL,

  place VARCHAR(45) NOT NULL,
  eventDate DATETIME NOT NULL,
  description VARCHAR(255),

  PRIMARY KEY(ID)

)

--------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS message(

  ID INT UNSIGNED NOT NULL AUTO_INCREMENT,

  senderID INT NOT NULL,
  receiverID INT NOT NULL,

  content VARCHAR(255) NOT NULL,
  msgDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  hidden BOOLEAN DEFAULT 0,

  PRIMARY KEY(ID)

)

--------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS request(

  senderID INT NOT NULL,
  receiverID INT NOT NULL,

  rejected BOOLEAN DEFAULT 0,
  hidden BOOLEAN DEFAULT 0,


  PRIMARY KEY(senderID, receiverID)
  FOREIGN KEY(senderID) REFERENCES user(ID),
  FOREIGN KEY(receiverID) REFERENCES user(ID)
)

--------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS post(

ID INT UNSIGNED NOT NULL AUTO_INCREMENT,
userID INT,

content VARCHAR(255) NOT NULL,
description VARCHAR(255),

postDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
postType SMALLINT,

hidden BOOLEAN DEFAULT 0,

PRIMARY KEY(ID),
FOREIGN KEY(userID) REFERENCES user(ID)

)

--------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS assistance(

  eventID INT NOT NULL,
  userID INT NOT NULL,

  PRIMARY KEY(eventID, userID),
  FOREIGN KEY(userID) REFERENCES user(ID),
  FOREIGN KEY(eventID) REFERENCES event(ID)
)

--------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS like(

  postID INT NOT NULL,
  userID INT NOT NULL,

  PRIMARY KEY(postID, userID),
  FOREIGN KEY(userID) REFERENCES user(ID),
  FOREIGN KEY(postID) REFERENCES post(ID)
)

--------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS comment(

  postID INT NOT NULL,
  userID INT NOT NULL,

  content VARCHAR(255) NOT NULL,

  PRIMARY KEY(postID, userID),
  FOREIGN KEY(userID) REFERENCES user(ID),
  FOREIGN KEY(postID) REFERENCES post(ID)
)
