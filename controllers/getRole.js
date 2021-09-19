const DB = require('../db-config');

async function getRole(user_id) {

    let q = `SELECT role->'role' as role FROM user_information WHERE user_id = '${user_id}'`;
    let role = await DB.executeQuery(q);
    if (!role[0]) {
        return null;
    } else {   
        //{ '1': 'upload_files', '2': 'view_files', '3': 'view_activities' }
        return role[0].role
    }
}

getRole("54")

module.exports = {
    getRole
}
