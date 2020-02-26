require('dotenv').config();
const { client } = require('../Shared/dbConnection');
const {
  uploadToS3,
  sizeOfImage,
  getSignedUrl,
  deleteObjectFromS3
} = require('../utils');
const { getEmployeeById } = require('../Employee/queries');
const camelcaseKeys = require('camelcase-keys')

const uploadEmployeeImage = async body => {
  return new Promise(async (resolve, reject) => {
    let pictureContent = body.image.split(';base64,')[1];
    let imageData = new Buffer(pictureContent, 'base64');
    let employeeData = await getEmployeeById(body.id);
    let employeeImageData = await getEmployeeImageById(body.id);
    console.log(employeeData);
    if (employeeData.length > 0) {
      await uploadToS3({
        data: imageData,
        key: `${body.id.toString()}_${employeeData[0].name.split(' ')[0]}`,
        imageType: body.image.split(';')[0].split(':')[1]
      })
        .then(async response => {
          console.log('Image was uploaded: ', response);
          const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `${body.id.toString()}_${employeeData[0].name.split(' ')[0]}`
          };
          let signedUrl = await getSignedUrl(params);
          let size = await sizeOfImage(params);
          let pictureObject = {
            name: `${body.id.toString()}_${employeeData[0].name.split(' ')[0]}`,
            date: new Date().toISOString(),
            size: Math.ceil(size / 1000),
            s3_url: signedUrl,
            employee_id: body.id
          };
          let query;
          if (employeeImageData > 0) {
            query = `UPDATE picture
            SET date_updated = '${pictureObject.date}',
                size = ${pictureObject.size},
                s3_url = '${pictureObject.s3_url}'
            WHERE
               employee_id = ${body.id}`;
          }
          else {
            query = `INSERT INTO picture(name, date_updated, size, s3_url, employee_id)
            VALUES
            ('${pictureObject.name}', '${pictureObject.date}', ${pictureObject.size}, '${pictureObject.s3_url}', ${pictureObject.employee_id});`;
          }
          console.log(pictureObject);
          client.query(query, (error, results) => {
            if (error) {
              reject(
                { message: 'Failed to insert Record in Picture Table' },
                error,
                results
              );
            }
            resolve({ message: 'Record Successfully inserted' });
          });
        })
        .catch(error => {
          console.log('Error Uploading File');
          result = error.message;
          reject(error);
        });
    }
  });
};

const getEmployeeImages = () => {
  return new Promise((resolve, reject) => {
    client.query('SELECT * from picture ORDER BY id', (error, results) => {
      if (error) {
        reject({ message: 'Failed to retrieve Employee Images Data', error });
      }
      resolve(camelcaseKeys(results.rows));
    });
  });
};

const getEmployeeImageById = id => {
  return new Promise((resolve, reject) => {
    client.query(`SELECT * from picture WHERE employee_id = ${id}`, (error, results) => {
      if (error) {
        reject({ message: 'Failed to retrieve Employee Images Data', error });
      }
      resolve(camelcaseKeys(results.rows));
    });
  });
};

const deleteEmployeeImageById = id => {
  return new Promise(async (resolve, reject) => {
    let employeeData = await getEmployeeById(id);
    if (employeeData.length > 0) {
      await deleteObjectFromS3({
        Bucket: process.env.BUCKET_NAME,
        Key: `${id}_${employeeData[0].name.split(' ')[0]}`
      })
        .then(response => {
          let query = `DELETE FROM picture WHERE employee_id = ${id}`;
          client.query(query, (error, results) => {
            if (error) {
              reject({
                message: 'Failed to Delete Employee Image Data',
                error
              });
            }
            resolve({ message: 'Image Deleted Successfully' });
          });
        })
        .catch(error => {
          reject({ message: 'Failed to Delete Employee Image Data', error });
        });
    }
  });
};

const updateEmployeeImage = async body => {
  return new Promise(async (resolve, reject) => {
    let pictureContent = body.image.split(';base64,')[1];
    let imageData = new Buffer(pictureContent, 'base64');
    let employeeData = await getEmployeeById(body.id);
    let employeeImageData = await getEmployeeImageById(body.id);
    console.log(employeeData, employeeImageData);
    if (employeeImageData.length > 0) {
      if (employeeData.length > 0) {
        await uploadToS3({
          data: imageData,
          key: `${body.id.toString()}_${employeeData[0].name.split(' ')[0]}`,
          imageType: body.image.split(';')[0].split(':')[1]
        })
          .then(async response => {
            console.log('Image was uploaded: ', response);
            const params = {
              Bucket: process.env.BUCKET_NAME,
              Key: `${body.id.toString()}_${employeeData[0].name.split(' ')[0]}`
            };
            let signedUrl = await getSignedUrl(params);
            let size = await sizeOfImage(params);
            let pictureObject = {
              date: new Date().toISOString(),
              size: Math.ceil(size / 1000),
              s3_url: signedUrl
            };
            let query = `UPDATE picture
            SET date_updated = '${pictureObject.date}',
                size = ${pictureObject.size},
                s3_url = '${pictureObject.s3_url}'
            WHERE
               employee_id = ${body.id}`;
            console.log(pictureObject);
            client.query(query, (error, results) => {
              if (error) {
                console.log(error)
                reject(
                  { message: 'Failed to Update Record in Picture Table' },
                  error,
                  results
                );
              }
              resolve({ message: 'Record Successfully inserted' });
            });
          })
          .catch(error => {
            console.log('Error Uploading File');
            result = error.message;
            reject(error);
          });
      }
    } else {
      reject({ message: 'No image Record found to update' });
    }
  });
};

module.exports = {
  uploadEmployeeImage,
  getEmployeeImages,
  deleteEmployeeImageById,
  updateEmployeeImage
};
