const DB = require('./db-config')

async function exe(query) {
    
    let res = await DB.executeQuery(query);
    console.log(res);
}

sexe(query)
