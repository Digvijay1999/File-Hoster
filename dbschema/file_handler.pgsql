CREATE TABLE IF NOT EXISTS user_credentials (  
    user_id SERIAL PRIMARY KEY NOT NULL,
    username varchar(20) UNIQUE NOT NULL,
    userpassword varchar(10) NOT NULL,
    access BOOLEAN NOT NULL
)

CREATE TABLE IF NOT EXISTS user_information (  
    user_id integer NOT NULL,
    name varchar(30),
    address text,
    email varchar(128) UNIQUE,
    age smallint,
    gender varchar(6),
    role smallint,
    FOREIGN KEY (user_id) REFERENCES user_credentials(user_id)
)

CREATE TABLE IF NOT EXISTS user_files (
    user_id integer  NOT NULL ,
    username varchar(20) UNIQUE  NOT NULL ,
    directory text NOT NULL ,
    filesize integer NOT NULL ,
    filename TEXT NOT NULL 
)

CREATE TABLE IF NOT EXISTS userfiles_actions (
    username VARCHAR UNIQUE NOT NULL,
    time VARCHAR(50),
    action VARCHAR(20),
    file_name TEXT NOT NULL
)

CREATE TABLE IF NOT EXISTS user_storagespace (
    user_id INTEGER UNIQUE NOT NULL,
    space NUMERIC NOT NULL
)

//join tables
SELECT user_files.user_id,user_credentials.username
FROM user_files
JOIN user_credentials
ON user_credentials.user_id = user_credentials.user_id
