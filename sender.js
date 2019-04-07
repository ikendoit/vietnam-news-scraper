var AWS = require('aws-sdk'),
    fs = require('fs');

require("dotenv").config();

const timestamp = new Date().getTime();

/*
  send files to aws s3
*/

AWS.config.update({ 
  accessKeyId: process.env.AWS_ACCESS_ID_WRITER, 
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_WRITER,
  region: process.env.region,
});
var s3 = new AWS.S3({signatureVersion: 'v4'});

module.exports = (fileName, fileData) => {

  var params = {
    Body: `${fileData}`,
    Bucket: process.env.AWS_BUCKET,
    Key: `${timestamp}/${fileName}`,
  };

  s3.upload(params, async (err, data) => {
    if(err) {
        console.log("Error uploading: ", err);
        console.log('shit data are ', fileData, fileName);
    } else {
        console.log("success for ", fileName);
    }
  });

}
