const DB = require('../../db-config')

/**
 *returns the total storage space (in mb) used by users 
 * @param {number} user_id 
 * @return {number} total space used by the user of user_id
 */
async function totalusedspace(user_id) {
    let totalusedspace = `SELECT SUM(filesize)
    FROM user_files
    WHERE user_id = '${user_id}';`

    let sum = await DB.executeQuery(totalusedspace)

    let totalsum = 0;
    if (sum[0].sum == null) {
        totalsum = 0
        return totalsum
    } 
    return sum[0].sum;
}

totalusedspace(40);

module.exports = {
    totalusedspace
}