const DB = require('../../db-config')

/**
 *returns user_id,username,user_email,user_access of all users
 * @return {Array} 
 */
function users() { 
    // get name,access, email
    let query = `SELECT user_credentials.user_id,user_credentials.username,user_information.email, access
    FROM user_credentials
    LEFT JOIN user_information
    ON user_credentials.user_id = user_information.user_id
    `
    let result =  DB.executeQuery(query)
    return result;
}

users()

module.exports = {
    users: users
}

