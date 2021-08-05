const DB = require('../../db-config')

async function updateuser(user_id) {

}

/**
 * changes user acces to application from denied to allowed
 * @param {number} user_id
 */
async function activateUser(user_id) {
    console.log('active user called for '+ user_id);
    let query = `UPDATE user_credentials SET access = 'true' WHERE user_id = ${user_id}`
    await DB.executeQuery(query)
}

/**
 * changes user acces to application from allowed to denied
 * @param {number} user_id
 */
async function deactivateUser(user_id) {
    console.log('deactive user called for '+ user_id);
    let query = `UPDATE user_credentials SET access = 'false' WHERE user_id = ${user_id}`
    await DB.executeQuery(query)
}

module.exports = {
    updateuser,
    activateUser,
    deactivateUser
}

