const DB = require('../../db-config')

async function getAllowedSpace(user_id) {

    let allowedSpace = `SELECT space FROM user_storagespace WHERE user_id = '${user_id}'`
    let space = await DB.executeQuery(allowedSpace)
    return space[0].space
}



module.exports = {
    getAllowedSpace
}