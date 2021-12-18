//! import the gql tagged `` template function
const { gql } = require('apollo-server-express');

//! create our typeDefs
//* define 'Thought' with 'type Thought {}'. '_id = ID' is Stgring with a UNIQUE identifier value
//* define 'Query' with 'type Query {}' GraphQL data-type
//* thoughts(username: String) - enable us to query 'thoughts' with or without the username parameter
//* the ! in the 'user(username: String!)' indicates that the we MUST pass a parameter, it CANNOT be empty
const typeDefs = gql`
   type User {
      _id: ID
      username: String
      email: String
      friendCount: Int
      thoughts: [Thought]
      friends: [User]
   }

   type Thought {
      _id: ID
      thoughtText: String
      createdAt: String
      username: String
      reactionCount: Int
      reactions: [Reaction]
   }

   type Reaction {
      _id: ID
      reactionBody: String
      createdAt: String
      username: String
   }

   type Query {
      me: User
      users: [User]
      user(username: String!): User
      thoughts(username: String): [Thought]
      thought(_id: ID!): Thought
   }

   type Mutation {
      login(email: String!, password: String!): Auth
      addUser(username: String!, email: String!, password: String!): Auth
      addThought(thoughtText: String!): Thought
      addReaction(thoughtId: ID!, reactionbody: String!): Thought
      addFriend(friendId: ID!): User
   }

   type Auth {
      token: ID!
      user: User
   }
`;

module.exports = typeDefs;
