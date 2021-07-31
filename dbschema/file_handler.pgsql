CREATE TABLE user_credentials (  
    user_id SERIAL PRIMARY KEY,
    username varchar(20) UNIQUE ,
    userpassword varchar(10)
)

CREATE TABLE user_information (  
    user_id integer,
    name varchar(30),
    address text,
    email varchar(50) UNIQUE,
    age smallint,
    gender varchar(6),
    role smallint,
    FOREIGN KEY (user_id) REFERENCES user_credentials(user_id)
)

CREATE TABLE IF NOT EXISTS user_files (
    user_id integer,
    username varchar(20) UNIQUE ,
    directory text,
    filesize integer
)

INSERT INTO user_credentials (username,userpassword) 
        VALUES ('${payload.username}','${payload.userpassword}');

//incomplete action table
CREATE TABLE IF NOT EXISTS userfiles_actions (
    user_id integer UNIQUE,
    username varchar(20) UNIQUE ,
    time VARCHAR(50),
    action VARCHAR(20)
)

//join tables
SELECT user_files.user_id,user_credentials.username
FROM user_files
JOIN user_credentials
ON user_credentials.user_id = user_credentials.user_id
