const DB = require('../db-config')
const fs = require('fs')
const role = require('../controllers/roleUpdater')


/**
 *creates the user into data base
 * @param {object} payload username and password
 * @return {number} user_id created into database
 */
async function createUser(payload) {

    let role;
    let checkTable = `SELECT EXISTS (SELECT 1 FROM user_credentials);`
    let isTableEmpty = await DB.executeQuery(checkTable);
    if (isTableEmpty[0].exists) {
        role = 0;
    } else {
        role = 1;
    }

    let createUser = `INSERT INTO user_credentials (username,userpassword,access) 
        VALUES ('${payload.username}','${payload.userpassword}','true');`
    await DB.executeQuery(createUser);

    let getuserid = `SELECT user_id FROM user_credentials WHERE username = '${payload.username}'`;
    let result = await DB.executeQuery(getuserid);
    user_id = result[0].user_id;



    let insertUserInfo = `INSERT INTO user_information (user_id,username,name,address,email,age,gender,role) 
            VALUES ('${user_id}','${payload.username}','${payload.name}','${payload.useraddress}','${payload.useremail}','${payload.userage}','${payload.usergender}','${role}');`
    await DB.executeQuery(insertUserInfo);

    let createstoragespace = `INSERT INTO user_storagespace (user_id,space)
    VALUES('${user_id}','10')`
    await DB.executeQuery(createstoragespace);

    filedir = `./public/user-files/${payload.username}`
    await fs.mkdir(filedir, { recursive: true }, (error) => {
        if (error) {
            throw `could not sign up please try again laters`
        }
    })


    return user_id;
}

module.exports = {
    createUser: createUser
}