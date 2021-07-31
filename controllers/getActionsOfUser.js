const DB = require('../db-config')

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