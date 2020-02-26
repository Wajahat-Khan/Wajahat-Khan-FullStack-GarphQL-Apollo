'use strict';
const { getEmployeeImages } = require('./queries');

module.exports.getEmployeeImages = async event => {
  let result = await getEmployeeImages();
  return {
    statusCode: 200,
    body: JSON.stringify(result, null, 2)
  };
};
