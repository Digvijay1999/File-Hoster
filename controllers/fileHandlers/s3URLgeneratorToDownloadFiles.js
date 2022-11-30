const DB = require("../../db-config")
const aws = require("aws-sdk")
require("dotenv").config()

const s3 = new aws.S3({
    region: "ap-south-1",
    accessKeyId: process.env.Access_key_ID,
    Secret_access_key: process.env.Secret_access_key,
    signatureVersion: 'v4'
})

/**
 * get downloadable links of user files
 * @param  {[Number]} userid user_id of a user
 * @param  {[Number]} startingLimit starting limit 
 * @param  {[Number]} resultPerPage result per page
 * @return {[Array of Objects]}  get array of objects, where object has downlodable link of file,filename,filesize
 */
async function getFilesLinkS3(userid, startingLimit, resultPerPage) {
    let qry = `SELECT directory,filename,filesize FROM user_files WHERE user_id = ${userid} LIMIT ${startingLimit}, ${resultPerPage}`
    let res = await DB.executeQuery(qry);

    res.rows.forEach(async (doc) => {
        const uploadURL = await s3.getSignedUrlPromise('getObject', {
            Bucket: "storagebucketforfilehosterapp",
            Key: `${doc.directory}`,
            Expires: 3600
        })
        doc.directory = uploadURL
    });
    return res.rows;
}

module.exports = getFilesLinkS3;