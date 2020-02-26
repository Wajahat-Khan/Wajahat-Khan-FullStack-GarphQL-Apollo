'use strict';
const { updateEmployeeData } = require('./queries');

module.exports.updateEmployeeData = async (event) => {
  let result = await updateEmployeeData(
    event.pathParameters.id,
    JSON.parse(event.body)
  );
  return {
    statusCode: 200,
    body: JSON.stringify(result, null, 2)
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
