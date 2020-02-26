'use strict';
const { createNewEmployeeRecord } = require('./queries');

module.exports.createNewEmployeeRecord = async event => {
  let result = await createNewEmployeeRecord(JSON.parse(event.body));
  return {
    statusCode: 200,
    body: JSON.stringify(result, null, 2)
  };
};
