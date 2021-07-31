const { query } = require('express');
const DB = require('../db-config');

async function insertIntoAction(username,time,action,file_name) {
    let insertQuery = `INSERT INTO userfiles_actions (username,time,action,file_name)
    VALUES ('${username}','${time}','${action}','${file_name}');`

    DB.executeQuery(insertQuery);

    console.log('action added');

}

module.exports = {
    insertIntoAction: insertIntoAction
}