const DB = require('../../db-config')
const curretAllowedSpace = require('./getCurrentAllowedSpace')


async function usage() {

    var usageOfUsers = []

    let getAllUser = `SELECT user_id FROM user_credentials`
    let result = await DB.executeQuery(getAllUser)
    // [ { user_id: 27 }, { user_id: 28 } ]
    let arrayOfusers = result.map((element) => {
        return element.user_id
    })
    //[27,28]


    async function getstorage(arrayOfusers) {

        for (const user_id of arrayOfusers) {

            let getusername = `SELECT username FROM user_credentials WHERE user_id = '${user_id}'`
            let username = await DB.executeQuery(getusername)

            let allowedStorage = await curretAllowedSpace.getAllowedSpace(user_id)

            const sum = await getsum(user_id)
            // [ { sum: '1.836479' } ]
            usageOfUsers.push({

                user_id: user_id,
                username: username[0].username,
                spaceUsed: sum[0].sum,
                allowedStorage: allowedStorage

            });
        }

        //this happens after every loop is executed
        // let newPromise = new Promise((resolve, reject) => {
        //     resolve(usageOfUsers)
        // })

        return newPromise

    }

    async function getsum(user_id) {
        let totalStorage = `SELECT  SUM (filesize)
         FROM user_files
         WHERE user_id = '${user_id}'`

        return sum = await DB.executeQuery(totalStorage)
    }

    let newPromise = getstorage(arrayOfusers)

    return await newPromise
}


module.exports = {
    usage: usage
}
