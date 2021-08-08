const { Client } = require('pg');

let dbConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'test05',
    password: 'testPass',
    port: 5442,
}


/**
 *this function executes the passed query and 
 *returns the array of results
 * @param {String} query
 * @param {any} values
 * @return {Array} 
 */
async function executeQuery(query, values) {
    let client = await connectDB()
    let result = await client.query(query, values);
    return result['rows'];
}

/**
 *this function checks if db exists or not if not exits then creates one and makes the connection with db 
 *and returns the connected client
 * @return {*} 
 */
async function connectDB() {
    try {
        let client = new Client(dbConfig)
        await client.connect();
        return client;

    } catch (error) {
        if (error.code === '3D000') {
            try {
                console.log(`database "${dbConfig.database}" does not exist`);
                let defaultConfiguration = { ...dbConfig }
                defaultConfiguration.database = 'postgres';
                console.log(defaultConfiguration);
                //Create database using default connection
                let tempClient = new Client(defaultConfiguration);
                await tempClient.connect()
                console.log(`Seeding database: ${dbConfig.database}`);
                await tempClient.query(`CREATE DATABASE "${dbConfig.database}"`);
                console.log(`Database created.`);
                tempClient = new Client(dbConfig);
                await tempClient.connect()
                await importDBSchema(client);
                return client;
            } catch (error) {
                console.log(error);
            }
        } else {
            throw error
        }
    }
}



module.exports = {
    executeQuery: executeQuery,
    connectDB: connectDB
}


