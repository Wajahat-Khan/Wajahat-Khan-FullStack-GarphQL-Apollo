require('dotenv').config();
const Client = require('pg').Client;
const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
const sequelize = new Sequelize(`${process.env.DATABASE}`, `${process.env.USER_NAME}`, `${process.env.PASSWORD}`, {
  host: `${process.env.CONNECTION_STRING}`,
  dialect: 'postgres',
  define:{
    timestamps: false
  }

  });

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  const Employee = sequelize.define('employee', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    salary: {
      type: Sequelize.INTEGER
    },
    gender: {
      type: Sequelize.STRING
    },
    age: {
      type: Sequelize.INTEGER
    },
    experience: {
      type: Sequelize.INTEGER
    },
    role: {
      type: Sequelize.STRING
    }
  }, {
    freezeTableName: true,
    paranoid: true
  });

  Employee.sync().then(()=>{
    Employee.create({
      name:'WajahatSEQ',
      salary:120000,
      gender:'M',
      age:22,
      experience:2,
      role:"SSE"
    }).then(newEmp=>{
      console.log(newEmp)
      return
    })
  }).catch(err=>{
    console.log("Error ",err);
  })






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
module.exports = { client, sequelize };