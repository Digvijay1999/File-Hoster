const DB = require('../db-config')
const userid = require('./getuserid')

/**
 *insert user's file information into the database 
 * @param {string} user username
 * @param {string} directory path where file is stored
 * @param {number} filesize size of the file in mb
 * @param {string} filename file name
 */
async function fileEntry(user, directory, filesize, filename) {
    let user_id = await userid.userid(user)
    let insertFile = `INSERT INTO user_files (user_id,username,directory,filesize,filename)
    VALUES('${user_id}','${user}','${directory}','${filesize}','${filename}')`
    return await DB.executeQuery(insertFile)
}


/**
 *deletes the file entry from the database
 * @param {string} user username
 * @param {string} directory path of file
 */
async function filedelete(user, directory) {
    //deletes the file entry from the table
    let deletefile = `DELETE FROM user_files 
    WHERE username = '${user}' AND directory = '${directory}';`
    await DB.executeQuery(deletefile)
}


/**
 *returns the size of the file in MB
 * @param {string} user
 * @param {string} path
 * @return {number} 
 */
async function getFileSize(user, path) {
    let query = `SELECT filesize FROM user_files WHERE username = '${user}' AND directory = '${path}'`
    let result = await DB.executeQuery(query);
    let filesize = result[0].filesize
    return filesize;
}


module.exports = {
    fileEntry: fileEntry,
    filedelete: filedelete,
    getFileSize: getFileSize
}



