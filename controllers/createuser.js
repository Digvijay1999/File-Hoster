const DB = require('../db-config')


/**
 *creates the user into data base
 *
 * @param {object} payload
 * @return {number} 
 */
async function createUser(payload) {
    let createUser = `INSERT INTO user_credentials (username,userpassword,access) 
        VALUES ('${payload.username}','${payload.userpassword}','true');`
    await DB.executeQuery(createUser);

    let getuserid = `SELECT user_id FROM user_credentials WHERE username = '${payload.username}'`;
    let result = await DB.executeQuery(getuserid);
    user_id = result[0].user_id;
    let temprole = 0;

    let insertUserInfo = `INSERT INTO user_information (user_id,name,address,email,age,gender,role) 
            VALUES ('${user_id}','${payload.name}','${payload.useraddress}','${payload.useremail}','${payload.userage}','${payload.usergender}','${temprole}');`
    await DB.executeQuery(insertUserInfo);

    let createstoragespace = `INSERT INTO user_storagespace (user_id,space)
    VALUES('${user_id}','10')`
    await DB.executeQuery(createstoragespace);

    return user_id;
}

module.exports = {
    createUser: createUser
}