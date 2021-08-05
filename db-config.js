const { Client } = require('pg');

let dbconfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'file-handler',
    password: 'admin',
    port: 5432,
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
        let client = new Client(dbconfig)
        await client.connect();
        return client;

    } catch (error) {

        if (error.code === '3D000') {
            console.log(`database "${dbconfig.database}" does not exist`);
            let defaultConfiguration = { ...dbconfig }
            defaultConfiguration.database = 'file-handler';
            try {
                //Create database using default connection
                let tempClient = new Client(defaultConfiguration);
                await tempClient.connect()
                console.log(`Seeding database: ${dbConfiguration.database}`);
                await tempClient.query(`CREATE DATABASE "${dbConfiguration.database}"`);
                console.log(`Database created.`);
            } catch (error) {
                connectDB()
            }

            client = new Client(dbConfiguration);
            await client.connect()
            await importDBSchema(client);
            return client;

        } else {
            throw error
        }
    }
}


module.exports = {
    executeQuery: executeQuery,
    connectDB: connectDB
}


