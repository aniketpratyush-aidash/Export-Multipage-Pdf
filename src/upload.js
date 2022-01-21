const AWS = require("aws-sdk")
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,AWS_SESSION_TOKEN } = require("../utils/constants");


module.exports.upload_to_s3 = async function({file}){
    try {
        
        const AWS = require("aws-sdk")
        const awsConfig= {
            region:'us-west-2',
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
            sessionToken: AWS_SESSION_TOKEN
        }
        AWS.config.update(awsConfig)
        console.log(awsConfig)
        var s3=new AWS.S3();
        const s3result = await s3.upload({
            Bucket: 'ivms-testing-pdf1' + "/created",
            Key: `${"file4"}.pdf`,
            Body: file,
            ContentType: "application/pdf",
            ACL: "public-read",
        })
        .promise();
        return s3result.Location;

    } catch (error) {
        console.log(error)
    }
}

