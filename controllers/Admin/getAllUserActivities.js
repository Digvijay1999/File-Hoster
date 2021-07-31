const DB = require('../../db-config')

async function  getAllUser() { 
    
    let query = `SELECT * FROM userfiles_actions`
    let result = await DB.executeQuery(query)
    return result
}

getAllUser()

module.exports = {
    getAllUser: getAllUser
}

