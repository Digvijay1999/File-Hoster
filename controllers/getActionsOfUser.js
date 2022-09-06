const DB = require('../db-config')

/**
 *returns the actions performed by user 
 *like login,logout,file-upload,file-delete

 * @param {string} user username 
 * @return {Array} actions of user
 */
async function getAction(user) {
    console.log(user);
    console.log('user action accessed');
    let getUserQuery = `SELECT * FROM userfiles_actions WHERE username = '${user}'`
    let result = await DB.executeQuery(getUserQuery);
    return result;
}

module.exports = {
    getAction: getAction
}