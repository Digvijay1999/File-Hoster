const DB = require('../db-config')

async function checker(reqBody) {

    let checkUser = `SELECT username FROM user_credentials WHERE username = '${reqBody.username}'`
    let checkEmail = `SELECT email FROM user_information WHERE email = '${reqBody.email}'`

    let user = await DB.executeQuery(checkUser)
    let email = await DB.executeQuery(checkEmail)

    let exist = {user:0, email:0}

    if (user.length) {
        exist.user = 1
    }

    if (email.length) {
        exist.email = 1
    } 
    return exist
}


module.exports = {
    checker
}