const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,AWS_SESSION_TOKEN } = require("../utils/constants");


module.exports.download_from_s3 = async function({name}){
    try {
        const AWS = require("aws-sdk")
        const awsConfig= {
            region:'us-west-2',
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
            sessionToken: AWS_SESSION_TOKEN
        }
        AWS.config.update(awsConfig)
        var s3 = new AWS.S3();
        const result = await s3.getObject({ Bucket: "ivms-testing-pdf1" + "/created", Key: name }).promise()
        console.log('Downloaded Pdf successfully ',name,result);
        return result;
    } catch (error) {
        console.log(error)
    }
}