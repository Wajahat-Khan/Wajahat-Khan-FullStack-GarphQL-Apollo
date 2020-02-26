'use strict';
const { deleteEmployeeImageById } = require('./queries');

module.exports.deleteEmployeeImageById = async event => {
  let result = await deleteEmployeeImageById(event.pathParameters.id);
  return {
    statusCode: 200,
    body: JSON.stringify(result, null, 2)
  };
};
