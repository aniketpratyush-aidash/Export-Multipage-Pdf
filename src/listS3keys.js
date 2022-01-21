var list = [];
const AWS = require("aws-sdk");
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,AWS_SESSION_TOKEN } = require("../utils/constants");


module.exports.listAllKeys = async function (s3bucket, start, end) {
  const awsConfig= {
        region:'us-west-2',
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
        sessionToken: AWS_SESSION_TOKEN
    }
    AWS.config.update(awsConfig)
    // console.log(awsConfig)

    const s3 = new AWS.S3()
    console.log("bucket name",s3bucket)
    const data = await s3.listObjects({
        Bucket: s3bucket,
        Marker: start,
        MaxKeys: 1000,
    }).promise()
    if (data.Contents) {
        console.log(data)
        for (var i = 0; i < data.Contents.length; i++) {
           var key = data.Contents[i].Key;    //See above code for the structure of data.Contents
            if (key.substring(0, 19) != end) {
                list.push(key);
            } else {
            break;   // break the loop if end arrived
            }
        }
        return list;
    }
}