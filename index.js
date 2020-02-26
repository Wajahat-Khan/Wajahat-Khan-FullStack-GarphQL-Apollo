const { ApolloServer, gql } = require('apollo-server');
const {getAllEmployees,getEmployeeById,createNewEmployeeRecord} = require('./src/Employee/queries')
const {getEmployeeImages,getEmployeeImageById} = require('./src/Picture/queries')
const typeDefs = gql`
  
scalar Date

  type Book {
    title: String
    author: String
  }

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
    date_updated: Date
    size: Int
    s3_url: String
    employee_id: Int
  }
  type Query {
    books: [Book]
    employee: [Employee]!
    employeeById (id: ID!) : [Employee]
    pictures: [Picture]
    pictureById:[Picture]
  }
  input EmployeeData {
    name:   String,
    salary: Int,
    gender: String,
    age:    Int,
    experience: Int,
    role:   String
  }
  type Mutation {
    addEmployee (data: EmployeeData): [Employee]
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
        },
        pictureById: async (_,args)=>{
            result = await getEmployeeImageById(args.id);
            return result  
        },  

    },
    Mutation:{
        addEmployee: async (_,args) => {
            result = await createNewEmployeeRecord(args.data)
            return result
        }
      
    }
  };


  const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

