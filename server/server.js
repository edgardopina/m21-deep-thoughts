const express = require('express');
const path = require('path');

const { ApolloServer } = require('apollo-server-express'); //* import Apollo server 
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 3001;
const app = express();

//* create a new Apollo server and pass in the schema data
const startServer = async () => {
   const server = new ApolloServer({
      typeDefs,
      resolvers,
      //* This line ensures that every request performs an authentication check, and the updated request object will
      //* be passed to the resolvers as the context.
      context: authMiddleware,
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

//* serve up static assets (React front-end code)
//* if the Node environment is in production then the Express.js server to serve any files in the React application's
//* build directory in the client folder
if (process.env.NODE_ENV === 'production') {
   app.use(express.static(path.join(__dirname, '../client/build')));
}
//* create a wildcard GET route for the server. If we make a GET request to any location on the server that doesn't
//* have an explicit route defined, respond with the production-ready React frontend code.
app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
   app.listen(PORT, () => {
      console.log('API server running on port ', PORT, '!');
   });
});
