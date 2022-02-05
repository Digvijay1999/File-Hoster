const { Client } = require('pg');
const Path = require('path');
const _ = require('lodash');
const Fs = require('graceful-fs');
const { off } = require('process');

// let dbConfig = {
//     user: process.env.HEROKU_USER,
//     host: process.env.HEROKU_HOST,
//     database: process.env.HEROKU_DB,
//     password: process.env.HEROKU_PASSWORD,
//     port: process.env.PORT || "5432",
//     ssl: { rejectUnauthorized: false },
// }
let dbConfig = {
    user: "sjayqkttpvnrfr",
    host: "ec2-54-158-247-97.compute-1.amazonaws.com",
    database: "d4hdvoc940aju",
    password: "c9ce6a3a387931e105155b09931f30151d4a10913aac2e096ce2781ff3546c03",
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
