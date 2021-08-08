const DB = require('../../db-config')
const curretAllowedSpace = require('./getCurrentAllowedSpace')


async function usage() {


    let getAllUser = `SELECT user_id FROM user_credentials`
    let result = await DB.executeQuery(getAllUser)
    // [ { user_id: 27 }, { user_id: 28 } ]
    let arrayOfUsers = result.map((element) => {
        return element.user_id
    })

    return await getStorage(arrayOfUsers)
}

async function getStorage(arrayOfUsers) {
    var usageOfUsers = []
    for (const user_id of arrayOfUsers) {

        let getUserName = `SELECT username FROM user_credentials WHERE user_id = '${user_id}'`
        let username = await DB.executeQuery(getUserName)

        let allowedStorage = await curretAllowedSpace.getAllowedSpace(user_id)

        const sum = await getsum(user_id)
        usageOfUsers.push({
            user_id: user_id,
            username: username[0].username,
            spaceUsed: sum[0].sum,
            allowedStorage: allowedStorage
        });
    }

    return usageOfUsers

}

async function getsum(user_id) {
    let totalStorage = `SELECT  SUM (filesize)
     FROM user_files
     WHERE user_id = '${user_id}'`
    return await DB.executeQuery(totalStorage)
}

module.exports = {
    usage: usage
}
