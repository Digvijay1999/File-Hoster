const DB = require('../db-config')
const fs = require('fs')

/**
 *creates the user into data base
 * @param {object} payload username and password
 * @return {number} user_id created into database
 */
async function createUser(payload) {

    let createUser = `INSERT INTO user_credentials (username,userpassword,access) 
    VALUES ('${payload.username.trim()}','${payload.userpassword}','true');`
    await DB.executeQuery(createUser);

    try {
        let getuserid = `SELECT user_id FROM user_credentials WHERE username = '${payload.username.trim()}'`;
        let result = await DB.executeQuery(getuserid);
        user_id = result[0].user_id;
        console.log("users id of user is" + user_id);
    } catch (error) {
        console.log("error while getting userid");
    }
   

    try {
        let insertUserInfo = `INSERT INTO user_information (user_id,username,name,address,email,age,gender,role) 
        VALUES ('${user_id}','${payload.username.trim()}','${payload.name}','${payload.useraddress}','${payload.useremail}','${payload.userage}','${payload.usergender}','{"role":[1,2,3]}');`
        await DB.executeQuery(insertUserInfo);
    } catch (error) {
        console.log("error while inserting user info"+error);
    }
  

    try {
        let createstoragespace = `INSERT INTO user_storagespace (user_id,username,space)
        VALUES('${user_id}','${payload.username.trim()}','10')`
        await DB.executeQuery(createstoragespace);
    } catch (error) {
        console.log("error while creating storage space");
    }
 

    try {
        filedir = `./public/user-files/${payload.username.trim()}`
        await fs.mkdir(filedir, { recursive: true }, (error) => {
            if (error) {
                throw `could not sign up please try again laters`
            }
        })
    } catch (error) {
        console.log("error while creating directory for user");
    }
  

    return user_id;
}

module.exports = {
    createUser: createUser
}