const DB = require('../../db-config')

/**
 * get all users from the database
 * @return {Array} return array of objects of users activities
 */
async function  getAllUser() { 
    let query = `SELECT * FROM userfiles_actions`
    let result = await DB.executeQuery(query)
    console.log(result);
    return result
}

getAllUser()

module.exports = {
    getAllUser: getAllUser
}

