require('dotenv').config();
const Sequelize = require('sequelize');
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

  Employee = sequelize.define('employee', {
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

// Employee.sync().then(()=>{
//     console.log("Employee Table sync complete")
// });


addEmp= async (obj)=>{

    await Employee.create(obj).then(newEmp=>{
      return(newEmp);
    }).catch(err=>{
        return;
    });
  
}

allEmp_params = async (order, sort)=>{
  const result=[]
  if(order){  
  await Employee.findAll({
      order: [
        [`${order}`, `${sort}`]
      ]
    }).map(e=>{
      result.push(e.dataValues)
    })
    return(result)
  }
  else{
    await Employee.findAll().map(e=>{
      result.push(e.dataValues)
    })
    return(result)
  }
}
allEmp = async ()=>{
  const result=[]
    await Employee.findAll().map(e=>{
      result.push(e.dataValues)
    })
    return(result)
}
EmpId= async(id)=>{
  const result=[]
  await Employee.findAll({
    where:{
      id:parseInt(`${id}`)
    }
  }).map(e=>{
    result.push(e.dataValues)
  })
    return result;
}
updateEmp= async(id, body)=>{
  const result=[]
  await Employee.update(body, {where: { id: parseInt(`${id}`) } })
  .then(updatedMax => {
    console.log(updatedMax)
  })


  // await Employee.findOne({
    
  //     id:parseInt(`${id}`)
    
  // }).then(res=>{
  //   let final=res.dataValues.map(e=>{
  //     e.updateAttributes(body)
  //   });
  //   return final;
  // }).catch(err=>{
  //   return err;
  // })

    
}

module.exports={sequelize,addEmp,allEmp,allEmp_params,EmpId,updateEmp}