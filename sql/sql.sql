create database blog character set utf8;
flush privileges;
use blog;

CREATE TABLE user(
    id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nickname VARCHAR(30),
    avatar VARCHAR(150),
    password VARCHAR(100),
    createtime DATETIME,
    updatetime DATETIME
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE tag(
    id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30),
    createtime DATETIME,
    updatetime DATETIME
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE article(
    id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30)
    content TEXT,
    tagID INT,
    userID INT,
    createtime DATETIME,
    updatetime DATETIME
) DEFAULT CHARSET=utf8mb4;
