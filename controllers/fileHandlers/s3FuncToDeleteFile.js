const DB = require("../../db-config")
const aws = require("aws-sdk")
const { insertIntoAction } = require("../insertActionsToDB")
require("dotenv").config()

const s3 = new aws.S3({
    region: "ap-south-1",
    accessKeyId: process.env.Access_key_ID,
    Secret_access_key: process.env.Secret_access_key,
    signatureVersion: 'v4',
})

async function deletefile(userid, username, filename) {
    let awsFileKey = `${username}-${userid}-${filename}`

    console.log(awsFileKey);

    var params = { Bucket: 'storagebucketforfilehosterapp', Key: `${awsFileKey}` };

    s3.deleteObject(params, async function (err, data) {
        if (err) {
            console.log(err, err.stack);
            return 0;
        }
        else {
            qry = `DELETE FROM user_files WHERE directory = '${awsFileKey}' AND user_id=${userid}`
            await DB.executeQuery(qry);
            insertIntoAction(username, new Date().toISOString(), 'delete', filename)
            return 1;
        }
    });
}

module.exports = { deletefile }