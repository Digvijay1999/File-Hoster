const DB = require('../../db-config')

async function totalusedspace(user_id) {

    let totalusedspace = `SELECT SUM(filesize)
    FROM user_files
    WHERE user_id = '${user_id}';`

    let sum = await DB.executeQuery(totalusedspace)
    let totalsum = 0;
    if (sum[0].sum == null) {
        totalsum = 0
        console.log(totalsum);
        return totalsum
    } 
    return sum[0].sum;
}


module.exports = {
    totalusedspace
}