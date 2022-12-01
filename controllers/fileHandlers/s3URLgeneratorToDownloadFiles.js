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
    let qry = `SELECT directory,filename,filesize FROM user_files WHERE user_id = ${userid} OFFSET ${startingLimit} LIMIT ${resultPerPage};`
    let res = await DB.executeQuery(qry);

    for (let index = 0; index < res.length; index++) {
        const element = res[index];
        const uploadURL = await s3.getSignedUrlPromise('getObject', {
            Bucket: "storagebucketforfilehosterapp",
            Key: `${element.directory}`,
            Expires: 3600
        })
        res[index].directory = uploadURL
    }
    return res;
}

module.exports = { getFilesLinkS3 };