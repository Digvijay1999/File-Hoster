const DB = require('../../db-config')
const fs = require('fs');
const path = require('path');

/**
 *delete the user from the database 
 * @param {string} user username
 */
async function deleteuser(user) {
    try {
        let query = `DELETE FROM user_credentials WHERE username = '${user}'`
        await DB.executeQuery(query)
    } catch (error) {
        console.log('error inside deletefrom user-cred');
    }
    const filepath = path.join(__dirname, `../../public/user-files/${user}`);
    fs.rmSync(filepath, { recursive: true });

    try {
        let deleteAction = `DELETE FROM userfiles_actions WHERE username = '${user}'`
        DB.executeQuery(deleteAction)
    } catch (error) {
        console.log('error inside deletefrom user_filesactions');
    }
}

module.exports = {
    deleteuser: deleteuser
}
