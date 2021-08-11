const DB = require('../db-config')

/** updates the role of the user 
 * @param {Number} user_id 
 * @param {Number} role role of the user 
 */
function updateRole(user_id,role) {
    let updateRole = `UPDATE user_information
    SET role = ${role}
    WHERE user_id = ${user_id}`

    DB.executeQuery(updateRole)
}

module.exports = {
    updateRole
}