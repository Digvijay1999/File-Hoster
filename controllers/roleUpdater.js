const DB = require('../db-config')

const roles = { "admin": "0", "upload_files": "1", "view_files": "2", "view_activities": "3" };

/** updates the role of the user 
 * @param {Number} user_id 
 * @param {Number} role role of the user 
 */
async function removeRole(user_id, role) {

    let query = `select role->'role' as role from user_information where user_id = ${user_id}`;
    let result = await DB.executeQuery(query);
    let userRole = result[0].role;

    let removeRole = roles[role];

    let newUserRole = userRole.filter(item => {
        if (item != removeRole) {
            return true;
        }
    })
    console.log(newUserRole);
    let str = `[${newUserRole}]`

    let updateRole = `UPDATE user_information SET role = '{"role":${str}}' WHERE user_id = ${user_id}`;
    await DB.executeQuery(updateRole);
}

async function addRole(user_id, role) {

    let query = `select role->'role' as role from user_information where user_id = ${user_id}`;
    let result = await DB.executeQuery(query);
    let userRole = result[0].role;

    let addRole = roles[role];
    userRole.push(addRole);

    let str = `[${userRole}]`

    let updateRole = `UPDATE user_information SET role = '{"role":${str}}' WHERE user_id = ${user_id}`;
    await DB.executeQuery(updateRole);
}


module.exports = {
    removeRole,
    addRole
}