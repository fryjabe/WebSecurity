USE `securityDB`;

CALL createUser('Sample', 'test@m.co', 'pass', 'A');

CALL createPost(1, 'moc', '', 0);

CALL showFeed();

CALL findUserLogin('j@mail.com');

CALL findUserRegister('test@m.co');

CALL updateLogin('j@mail.com');

CALL verifyAccount('A');

CALL findUserLogin('j@mail.com');


SELECT * FROM user;
SELECT * FROM post;
        
        
