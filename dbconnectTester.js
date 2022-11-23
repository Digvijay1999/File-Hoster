// const { Client } = require('pg');
// require("dotenv").config()
// var fs = require('fs');
// const path = require('path');

// var sql = fs.readFileSync(path.join(__dirname, '/dbschema', "/intialDatabaseSetup.pgsql")).toString();

// const connectDB = async () => {

//     try {
//         const client = new Client({
//             user: process.env.DB_USER,
//             host: process.env.DB_HOST,
//             database: process.env.DB_DATABASE,
//             port: process.env.DB_PORT,
//             password: process.env.DB_PASSWORD
//         })

//         await client.connect().then(() => {
//             client.query(sql, function (err, result) {
//                 if (err) {
//                     console.log('error: ', err);
//                     process.exit(1);
//                 }
//                 process.exit(0);
//             });
//         })
//     } catch (error) {
//         throw error
//     }
// }

// connectDB()
//------------------------------------------------------------------------------------


// const { Client } = require('pg');
// require("dotenv").config()
// var fs = require('fs');
// const path = require('path');

// var sql = fs.readFileSync(path.join(__dirname, '/dbschema', "/intialDatabaseSetup.pgsql")).toString();

// const connectDB = async () => {

//     const client = new Client({
//         user: process.env.DB_USER,
//         host: process.env.DB_HOST,
//         database: process.env.DB_DATABASE,
//         port: process.env.DB_PORT,
//         password: process.env.DB_PASSWORD
//     })
//     let count = 1;

//     while (true) {
//         setTimeout(async () => {
//             await client.connect().then(() => {
//                 count++;
//                 console.log("client number " + count);
//             })
//         }, 1000);
//     }
// }

// connectDB()

// -------------------------------------------------------------------------------------

const { Pool } = require('pg');
require("dotenv").config()

const connectDB = async () => {

    const client = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        max: 20
    })

    await client.connect()

    Pool.query("SELECT * FROM user_information").then((res) => {
        console.log("query is executed");
        console.log(res.rows);
    });

    //cli.release()
}

connectDB()