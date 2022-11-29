let DB = require("../../db-config")

function storeFilesNames(userid, username, fileKey, filesize, filename) {

    let query = `INSERT INTO user_files (user_id,username,directory,filesize,filename)
                 VALUES (${userid},${username},${fileKey},${filesize},${filename})`

    DB.executeQuery(query)
}