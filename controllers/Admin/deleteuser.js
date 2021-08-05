const DB = require('../../db-config')
const fs = require('fs');
const path = require('path');

/**
 *delete the user from the database 
 * @param {string} user username
 */
async function deleteuser(user) {
    let query = `DELETE FROM user_credentials WHERE username = '${user}'`
    await DB.executeQuery(query)
    const filepath = path.join(__dirname, `../../public/user-files/${user}`);
    fs.rmdirSync(filepath, { recursive: true });

    let deleteAction = `DELETE FROM userfiles_actions WHERE username = ${user}`
    DB.executeQuery(deleteAction)
}

module.exports = {
    deleteuser: deleteuser
}
