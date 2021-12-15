const { gql } = require('apollo-server-express'); //! import the gql tagged `` template function

//! create our typeDefs
const typeDefs = gql`
   type Query {
      helloWorld: string
   }
`;

module.exports = typeDefs;
