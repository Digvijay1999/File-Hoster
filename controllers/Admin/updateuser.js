const DB = require('../../db-config')

function updateuser(user) { 
    
    let query 
    let result =  DB.executeQuery(query)
    return result;
}

updateuser()

module.exports = {
    updateuser: updateuser
}

