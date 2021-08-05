const { query } = require('express');
const DB = require('../db-config');


/**
 *adds the actions of users into database 
 *actions like login,logout,add-file,delet-file
 * @param {string} username
 * @param {string} time
 * @param {string} action
 * @param {string} file_name
 */
async function insertIntoAction(username,time,action,file_name) {
    let insertQuery = `INSERT INTO userfiles_actions (username,time,action,file_name)
    VALUES ('${username}','${time}','${action}','${file_name}');`

    DB.executeQuery(insertQuery);

    console.log('action added');

}

module.exports = {
    insertIntoAction: insertIntoAction
}