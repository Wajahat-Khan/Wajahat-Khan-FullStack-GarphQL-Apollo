'use strict';
const { uploadEmployeeImage } = require('./queries');

module.exports.uploadEmployeeImage = async event => {
  let result = await uploadEmployeeImage(JSON.parse(event.body));
  return {
    statusCode: 200,
    body: JSON.stringify(result, null, 2)
  };
};
