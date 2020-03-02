const { client } = require('../Shared/dbConnection');
const camelcaseKeys = require('camelcase-keys');
const {addEmp,allEmp,allEmp_params,EmpId,updateEmp}= require('../Shared/dbConnection')

// const getAllEmployees = params => {
//   return new Promise((resolve, reject) => {
//     let query = `SELECT * from employee`;
//     if (params) {
//       if (params.sortBy) {
//         query = query + ` ORDER BY ${params.sortBy}`;
//         if (params.orderBy) {
//           query = query + ` ${params.orderBy}`;
//         }
//       }
//       if (params.page) {
//         query =
//           query +
//           ` OFFSET ${(Number(params.page) - 1) * 10} LIMIT ${Number(
//             params.page
//           ) * 10}`;
//       }
//     }
//     client.query(query, (error, results) => {
//       if (error) {
//         reject({ message: 'Failed to retrieves Employee Data', error });
//       }
//       resolve(camelcaseKeys(results.rows));
//     });
//   });
// };

const getAllEmployees = params => {
  return new Promise((resolve, reject) => {
    if (params) {
      const res= allEmp_params(params.orderBy,params.sortBy);
      if(res){
        resolve(res)
      }
      reject(e)
    } else{
      const res= allEmp();
      if(res){
        resolve(res)
      }
      reject(e)
    }
  })
};

// const getEmployeeById = id => {
//   return new Promise((resolve, reject) => {
//     client.query(
//       `SELECT * FROM employee WHERE id = ${id}`,
//       (error, results) => {
//         if (error) {
//           reject({ message: 'Failed to retrieve employee Data', error });
//         }
//         resolve(camelcaseKeys(results.rows));
//       }
//     );
//   });
// };

const getEmployeeById = id => {
  return new Promise((resolve, reject) => {
    const res= EmpId(id);
    if(res){
      resolve(res)
    }
    reject(e)
  });
};

const updateEmployeeData = (id, body) => {
  
  return new Promise((resolve, reject) => {
    let res= updateEmp(id, body);
    if(res) resolve(res)
    reject(res)
  });
};

// const createNewEmployeeRecord = async body => {
//   return new Promise((resolve, reject) => {
//     let query = `INSERT INTO employee(name, salary, gender, age, experience, role)
//     VALUES
//        ('${body.name}', ${body.salary}, '${body.gender}', ${body.age}, ${body.experience}, '${body.role}') RETURNING *;`;
//     client.query(query, (error, results) => {
//       if (error) {
//         reject({ message: 'Failed to insert record', error });
//       }
//       resolve(results.rows);
//     });
//   });
// };

const createNewEmployeeRecord = async body => {
  return new Promise((resolve, reject) => {
      const res= addEmp(body);
      if(res){
        resolve(res)
      }
      reject(e)
  });
};
const cascadeDelete = id => {
  return new Promise((resolve, reject) => {
    let query = `DELETE FROM picture WHERE employee_id = ${id}`;
    client.query(query, (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};

const deleteEmployee = id => {
  return new Promise((resolve, reject) => {
    cascadeDelete(id)
      .then(async response => {
        let query = `DELETE FROM employee WHERE id = ${id} RETURNING *`;
        let res= await getEmployeeById(id);
        client.query(query, (error, results) => {
          if (error) {
            console.log(error);
            reject({ message: 'Failed to delete record', error });
          }
          resolve(res);
        });
      })
      .catch(error => {
        console.log('Failed to delete cascading records', error);
      });
  });
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  updateEmployeeData,
  createNewEmployeeRecord,
  deleteEmployee
};
