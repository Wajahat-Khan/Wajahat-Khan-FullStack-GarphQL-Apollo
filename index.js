const { ApolloServer, gql } = require('apollo-server');
const {getAllEmployees,getEmployeeById,createNewEmployeeRecord,updateEmployeeData,deleteEmployee} = require('./src/Employee/queries')
const {getEmployeeImages,uploadEmployeeImage,deleteEmployeeImageById,updateEmployeeImage} = require('./src/Picture/queries')
const typeDefs = gql`
  
scalar Date


  type Employee{
    id: ID,
    name:   String,
    salary: Int,
    gender: String,
    age:    Int,
    experience: Int,
    role:   String
  }
  type Picture {
    id: ID
    name: String
    date_updated: String
    size: Int
    s3Url: String
    employee_id: Int
  }


  type Query {
    employee: [Employee]!
    employeeById (id: ID!) : [Employee]
    pictures: [Picture]
  }
  input EmployeeData {
    name:   String,
    salary: Int,
    gender: String,
    age:    Int,
    experience: Int,
    role:   String
  }
  
  input PictureData {
    image: String
    id:ID!
    
  }
  type Mutation {
    addEmployee (data: EmployeeData): [Employee]
    updateEmployee(id: ID!, data: EmployeeData): [Employee]
    delEmployee(id : ID!): [Employee]
    
    addPicture(id: ID!, image: String): [Picture]
    updatePicture (id: ID!, image: String): [Picture]
    delPicture(id:ID!):[Picture]
}
`;


  const resolvers = {
    Query: {
        employee: async ()=>{ 
            const result=  await getAllEmployees();
            return result;
        },
        employeeById: async (_,args)=>{
            result = await getEmployeeById(args.id); 
            return result  
        },
        pictures:async ()=>{
            const result=  await getEmployeeImages();
          return result;
        }

    },
    Mutation:{
        addEmployee: async (_,args) => {
            result = await createNewEmployeeRecord(args.data)
            return result
        },
        updateEmployee: async (_,args)=>{
            result = await updateEmployeeData(args.id, args.data)
            return result
        },
        delEmployee: async (_,args)=>{
            result = await  deleteEmployee(args.id)
            return result
        },
        addPicture: async (_,args)=>{
            let body={
            }
            body.id=args.id;
            body.image=args.image
            result = await  uploadEmployeeImage(body)
            return result
        },
        updatePicture: async (_,args)=>{
            let body={
            }
            body.id=args.id;
            body.image=args.image
            result = await  updateEmployeeImage(body)
            return result
        },
        delPicture: async (_,args)=>{
            result = await  deleteEmployeeImageById(args.id)
            return result
        },

    }
  };


  const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

