require('dotenv').config();
const Client = require('pg').Client;

const client = new Client({
  host: process.env.CONNECTION_STRING,
  port: process.env.PORT,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
})

client.connect(err => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('Connection Successful to RDS !!!')
  }
})
module.exports = { client };