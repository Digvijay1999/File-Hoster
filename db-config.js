const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config()


var sql = fs.readFileSync(path.join(__dirname, '/dbschema', "/intialDatabaseSetup.pgsql")).toString();
let pgPool;

let dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: 20
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
        let cli = await pgPool.connect()
        let result = await cli.query(query, values);
        cli.release()
        let res = result.rows;
        return res;
    } catch (error) {
        throw error
    }

}

/**
 *try to make connection to database 2 times and return the client if successful else throw an error
 * @return {Client} 
 */
async function connectDB(callback) {
    try {
        var pool = new Pool(dbConfig)
        let clie = await pool.connect()
        clie.release()
        pgPool = pool
    } catch (error) {
        console.log("could not connect to db, retrying...");
        try {
            let clie = await pool.connect()
            clie.release()
            pgPool = pool;
        } catch (error) {
            console.log("could not connect to db, exiting..");
        }
    } finally {
        callback()
    }
}

const seedTables = async () => {
    let cli = await pgPool.connect()
    cli.query(sql, (err, result) => {
        if (err) {
            console.log("error while seeding database");
        } else {
            console.log("database seeded successfully!");
        }
    })
}

module.exports = {
    executeQuery,
    connectDB,
    seedTables
}
