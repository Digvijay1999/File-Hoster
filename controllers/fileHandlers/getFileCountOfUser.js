const DB = require("../../db-config")

async function getFileCount(userid) {
    let qry = `SELECT COUNT(user_id) as total FROM user_files WHERE user_id = ${userid}`
    let res = await DB.executeQuery(qry);
    return res[0].total
}

module.exports = { getFileCount }