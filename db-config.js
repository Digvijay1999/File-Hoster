const { Client } = require('pg');
const Path = require('path');
const _ = require('lodash');
const Fs = require('graceful-fs');
const { off } = require('process');


// let dbConfig = {
//     user: 'postgres',
//     host: 'localhost',
//     database: 'file-handler',
//     password: 'admin',
//     // port: 5442,
// }

let dbConfig = {
    user: 'sjayqkttpvnrfr',
    host: 'ec2-54-158-247-97.compute-1.amazonaws.com',
    database: 'd4hdvoc940aju',
    password: 'c9ce6a3a387931e105155b09931f30151d4a10913aac2e096ce2781ff3546c03',
    port: 5432,
    ssl: {rejectUnauthorized: false},
    URL: "postgres://sjayqkttpvnrfr:c9ce6a3a387931e105155b09931f30151d4a10913aac2e096ce2781ff3546c03@ec2-54-158-247-97.compute-1.amazonaws.com:5432/d4hdvoc940aju"
}

/**
 *this function executes the passed query and 
 *returns the array of results
 * @param {String} query
 * @param {any} values
 * @return {Array} 
 */
async function executeQuery(query, values) {
    console.log("execute query called");
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
        await client.connect().then(()=>{
            console.log("database connection was successful");
            return client;
        });

    } catch (error) {
        console.log("could not find database");
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
                await tempClient.connect().then(()=>{
                    console.log("database connection was successful");
                }).catch((error)=>{
                    console.log("error occurred while connecting to the database "+error);
                })
                await importDBSchema(tempClient);
                return tempClient;
            } catch (error) {
                console.log(error);
            }
        } else {
            throw error
        }
    }
}

async function importDBSchema(client) {


    try {
        let sqlFilePath = Path.join(__dirname, './dbschema', 'file_handler.pgsql');
        let sqlQueriesString = await Fs.readFileSync(sqlFilePath, 'utf-8');
        sqlQueriesString = sqlQueriesString.replace(/\n/gm, '');
        let sqlQueries = sqlQueriesString.split(';');
        //Remove empty values
        sqlQueries = _.compact(sqlQueries);
        //Execute all queries sequentially 
        for (let queryIndex = 0; queryIndex < sqlQueries.length; queryIndex++) {
            await client.query(sqlQueries[queryIndex]);
        }
        console.log(`Database schema imported.`);
    } catch (error) {
        throw error;
    }

}



module.exports = {
    executeQuery: executeQuery,
    connectDB: connectDB
}


