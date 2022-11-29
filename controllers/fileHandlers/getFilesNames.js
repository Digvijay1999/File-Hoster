let DB = require('../../db-config')


async function getUsersFiles(username, userid) {
    let query = `SELECT directory FROM user_files WHERE username = '${username}' and user_id = ${userid}`
    let res = await DB.executeQuery(query)
    return res[0]
}

module.exports = getUsersFiles;