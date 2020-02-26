'use strict';
const { updateEmployeeImage } = require('./queries');

module.exports.updateEmployeeImage = async event => {
  let result = await updateEmployeeImage({
    id: event.pathParameters.id,
    image: JSON.parse(event.body).image
  });
  return {
    statusCode: 200,
    body: JSON.stringify(result, null, 2)
  };
};
