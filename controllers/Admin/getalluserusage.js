const DB = require('../../db-config')
const curretAllowedSpace = require('./getCurrentAllowedSpace')


async function usage() {


    let getAllUser =
    `SELECT uc.user_id, uc.username, (SELECT SUM (filesize) from user_files where username = uc.username  ) as sum,  us.space as space 
    FROM user_credentials uc
    LEFT JOIN user_storagespace as us ON  us.user_id = uc.user_id`
    return await DB.executeQuery(getAllUser)

    // // SELECT space FROM user_storagespace WHERE user_
    // let userIds = result.filter((user) => {
    //     return user.user_id
    // })
    // let allowedStorage = await curretAllowedSpace.getAllowedSpace(userIds)

    // let mapResultData = result.map((user) => {

    // })
    // return await getStorage(arrayOfUsers)
}

// async function getStorage(arrayOfUsers) {
//     var usageOfUsers = []
//     for (const user_id of arrayOfUsers) {

//         let getUserName = `SELECT username , SUM (uf.filesize) as size FROM user_credentials WHERE user_id = '${user_id}
//         LEFT JOIN user_files as uf ON uf.user_id = ${user_id}'`
//         let username = await DB.executeQuery(getUserName)

//         let allowedStorage = await curretAllowedSpace.getAllowedSpace(user_id)

//         // const sum = await getsum(user_id)
//         usageOfUsers.push({
//             user_id: user_id,
//             username: username[0].username,
//             spaceUsed: username[0].size,
//             allowedStorage: allowedStorage
//         });
//     }

//     return usageOfUsers

// }

// async function getsum(user_id) {
//     let totalStorage = `SELECT  SUM (filesize)
//      FROM user_files
//      WHERE user_id = '${user_id}'`
//     return await DB.executeQuery(totalStorage)
// }

module.exports = {
    usage: usage
}
