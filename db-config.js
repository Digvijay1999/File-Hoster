const { Client } = require('pg');
const Path = require('path');
const _ = require('lodash');
const Fs = require('graceful-fs');
const { off } = require('process');

let dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: "5432",
    ssl: { rejectUnauthorized: false }
}

/**
 *this function executes the passed query and 
 *returns the array of results
 * @param {String} query
 * @param {any} values
 * @return {Array} 
 */

async function executeQuery(query, values) {
    try {
        var client = await connectDB()
    } catch (error) {
        console.log("error while connecting to db");
    }
    let result = await client.query(query, values);
    client.end();
    let res = result.rows;
    return res;
}

/**
 *try to make connection to database 3 times and return the client if successful else throw an error
 * @return {Client} 
 */
async function connectDB() {

    try {
        var client = new Client(dbConfig)
        await client.connect()
        return client;
    } catch (error) {
        console.log("could not connect to db, retrying...");
        try {
            await client.connect()
            return client;
        } catch (error) {
            console.log("could not connect to db, exiting..");
        }
    }
}

module.exports = {
    executeQuery: executeQuery,
    connectDB: connectDB
}
