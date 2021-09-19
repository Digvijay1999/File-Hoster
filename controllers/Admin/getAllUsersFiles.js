const DB = require('../../db-config')
const userusedspace = require('./gettotalspaceusedbyuser')
const userallowedspace = require('./getCurrentAllowedSpace')
const userid = require('../getuserid')

/**
 *retuns the array of arrays for users 
 * @return {Array} 
 */
async function usersandfiles() {

    let getAllUser = `SELECT username FROM user_credentials`;
    let users = await DB.executeQuery(getAllUser)

    let userandfiles = []

    for (const data of users) {

        let username = data.username;

        let getfilesandsize = `SELECT filename, filesize FROM user_files WHERE username = '${username}'`
        let fileNameAndSize = await DB.executeQuery(getfilesandsize);
        let usedspace = await userusedspace.totalusedspace(await userid.userid(username));
        let allowedspace = await userallowedspace.getAllowedSpace(await userid.userid(username));

        fileNameAndSize.unshift({ username, allowedspace, usedspace })

        userandfiles.push(fileNameAndSize)
    }
    return userandfiles
}

module.exports = {
    usersandfiles
}

