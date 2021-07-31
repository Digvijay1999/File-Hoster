const DB = require('../../db-config')

function deleteuser(user) { 
    
    let query = `DELETE FROM user_credentials WHERE username = ${user}`
    let result =  DB.executeQuery(query)
}

module.exports = {
    deleteuser: deleteuser
}

