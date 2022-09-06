const DB = require('../db-config');

async function allRoles() {
    let q = `SELECT role FROM user_role`;
    let role = await DB.executeQuery(q);
    let roles = []

    role.forEach(element => {
        for (const key in element) {
            roles.push(element[key])
        }
    });

    // [ 'upload_files', 'view_files', 'view_activities', 'admin' ]
    return roles;
}

module.exports = {
    allRoles
}
