const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports.uploadToS3 = params => {
  return s3
    .putObject({
      Bucket: 'faheem-wajahat-node',
      Key: params.key,
      Body: params.data,
      ContentType: params.imageType
    })
    .promise();
};

module.exports.sizeOfImage = params => {
  return new Promise((resolve, reject) => {
    s3.headObject(params, (error, data) => {
      if (data) {
        resolve(data.ContentLength);
      }
      reject(-1);
    });
  });
};

module.exports.getSignedUrl = params => {
  return new Promise((resolve, reject) => {
    var url = s3.getSignedUrl('getObject', params);
    if (!url) {
      reject('Error');
    }
    resolve(url);
  });
};

module.exports.deleteObjectFromS3 = params => {
  return new Promise((resolve, reject) => {
    s3.deleteObject(params, function(err, data) {
      if (err) reject(error);
      else resolve(data);
    });
  });
};
