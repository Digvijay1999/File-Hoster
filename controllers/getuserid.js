const DB = require('../db-config')

/**
 *returns the user_id of the user
 *
 * @param {string} username 
 * @return {number} user_id of user
 */
async function userid(username) {  
    let getuserid = `SELECT user_id FROM user_credentials WHERE username = '${username}'`;
    let res = await DB.executeQuery(getuserid);
    let user_id = res[0].user_id;
    return user_id
}

module.exports = {
    userid : userid
}
