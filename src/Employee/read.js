'use strict';

const { getAllEmployees, getEmployeeById } = require('./queries');

module.exports.getAllEmployees = async event => {
  console.log(event)
  let result = await getAllEmployees(event.queryStringParameters);
  return {
    statusCode: 200,
    body: JSON.stringify(result, null, 2)
  };
};

module.exports.getEmployeeById = async (event, context) => {
  let result = await getEmployeeById(event.pathParameters.id);
  return {
    statusCode: 200,
    body: JSON.stringify(result, null, 2)
  };
};
