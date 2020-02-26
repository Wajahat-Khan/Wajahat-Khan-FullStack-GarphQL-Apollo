'use strict';
const { deleteEmployee } = require('./queries');

module.exports.deleteEmployee = async event => {
  let result = await deleteEmployee(event.pathParameters.id);
  return {
    statusCode: 200,
    body: JSON.stringify(result, null, 2)
  };
};
