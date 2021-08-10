const DB = require('../db-config')

async function checker(reqBody) {

    // { username: 'admin', password: 'admin' }
    let userExits = `SELECT username FROM user_credentials WHERE username = '${reqBody.username}'`
    let accessCheck = `SELECT access FROM user_credentials WHERE username = '${reqBody.username}'`
    let checkUsernamePassword = `SELECT userpassword FROM user_credentials WHERE username = '${reqBody.username}'`

    let result = await DB.executeQuery(userExits);

    //first check if user exists the proceed else return 
    if (result.length) {
        //check if user have access if not then return else proceed
        let result = await DB.executeQuery(accessCheck)

        if (result[0].access) {

            let result = await DB.executeQuery(checkUsernamePassword);

            if (result[0].userpassword == reqBody.password) {
                return 1;
                //access granted user exists, has access, password matched
            } else {
                return 'nopassword'
            }

        } else {
            return 'noaccess'
        }
    } else {
        return 'nouser'
    }

}

module.exports = { 
    checker
}