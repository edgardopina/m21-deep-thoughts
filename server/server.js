const express = require('express');

const { ApolloServer } = require('apollo-server-express'); //* import Apollo server from
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

//! this 'require' is to downgrade to previous playground functionality
// const {
//   ApolloServerPluginLandingPageGraphQLPlayground,
//   ApolloServerPluginLandingPageDisabled,
// } = require('apollo-server-core');

const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

//* create a new Apollo server and pass in the schema data
const startServer = async () => {
   const server = new ApolloServer({
      //! this 'plugins' is to downgrade to previous playground functionality
      // plugins: [
      //    process.env.NODE_ENV === 'production'
      //       ? ApolloServerPluginLandingPageDisabled()
      //       : ApolloServerPluginLandingPageGraphQLPlayground(),
      // ],
      typeDefs,
      resolvers,
      // context: authMiddleware,
   });

   await server.start(); //* START the Apollo server

   //* integrate the Apollo server with the Express application as midleware
   //* This will create a special /graphql endpoint for the Express.js server that will serve as the main endpoint
   //* for accessing the entire API. That's not all, the /graphql endpoint also has a built-in testing tool we can use
   server.applyMiddleware({ app });

   //* log where the GQL API can be tested
   console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

startServer(); //* INITIALIZE the Apollo server

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

db.once('open', () => {
   app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
   });
});
