CREATE TABLE IF NOT EXISTS user_credentials (  
    user_id SERIAL PRIMARY KEY NOT NULL,
    username varchar(20) UNIQUE NOT NULL,
    userpassword varchar(10) NOT NULL,
    access BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS user_information (  
    user_id integer NOT NULL,
    name varchar(30),
    address text DEFAULT 'On Earth',
    email varchar(128) UNIQUE,
    age smallint DEFAULT 0,
    gender varchar(6),
    role smallint,
    FOREIGN KEY (user_id) REFERENCES user_credentials(user_id)
);

CREATE TABLE IF NOT EXISTS user_files (
    user_id integer  NOT NULL ,
    username varchar(20) UNIQUE  NOT NULL ,
    directory text NOT NULL ,
    filesize NUMERIC NOT NULL ,
    filename TEXT NOT NULL 
);

CREATE TABLE IF NOT EXISTS userfiles_actions (
    username VARCHAR UNIQUE NOT NULL,
    time VARCHAR(50),
    action VARCHAR(20),
    file_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_storagespace (
    user_id INTEGER UNIQUE NOT NULL,
    space NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS user_storagespace (
    user_id integer UNIQUE,
    space varchar(20)
);
