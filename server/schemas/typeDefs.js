//! import the gql tagged `` template function
const { gql } = require('apollo-server-express');

//! create our typeDefs
//* define 'Thought' with 'type Thought {}'. '_id = ID' is Stgring with a UNIQUE identifier value
//* define 'Query' with 'type Query {}' GraphQL data-type
//* thoughts(username: String) - enable us to query 'thoughts' with or without the username parameter
//* the ! in the 'user(username: String!)' indicates that the we MUST pass a parameter, it CANNOT be empty
const typeDefs = gql`
   type Reaction {
      _id: ID
      reactionBody: String
      createdAt: String
      username: String
   }
   type Thought {
      _id: ID
      thoughtText: String
      createdAt: String
      username: String
      reactionCount: Int
      reactions: [Reaction]
   }
   type User {
      _id: ID
      username: String
      email: String
      friendCount: Int
      thoughts: [Thought]
      friends: [User]
   }
   type Query {
      users: [User]
      user(username: String!): User
      thoughts(username: String): [Thought]
      thought(_id: ID!): Thought
   }
`;

module.exports = typeDefs;
