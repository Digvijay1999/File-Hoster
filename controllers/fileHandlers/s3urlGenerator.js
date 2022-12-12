const aws = require("aws-sdk")
require("dotenv").config()

const s3 = new aws.S3({
    region: "ap-south-1",
    accessKeyId: process.env.Access_key_ID,
    Secret_access_key: process.env.Secret_access_key,
    signatureVersion: 'v4'
})

async function generateS3URL(filename) {
    const params = ({
        Bucket: "storagebucketforfilehosterapp",
        Key: `${filename}`,
        Expires: 30,
    })
    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    console.log("link generated for file upload");
    console.log(uploadURL);
    return uploadURL
}

module.exports = {
    generateS3URL
}