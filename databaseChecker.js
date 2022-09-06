const { Client } = require('pg');
var fs = require('fs');

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "fileHoster",
    password: "Digu@1234",
    port: "5432",
})
client.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});