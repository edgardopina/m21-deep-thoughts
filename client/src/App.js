import React from 'react';

//* ApolloProvider - is a special type of React component that we'll use to provide data to all of the other components.
//* ApolloClient - is a constructor function that will help initialize the connection to the GraphQL API server.
//* InMemoryCache - enables the Apollo Client to cache API response data so that perform requests run more efficiently.
//* createHttpLink - enables to control how the Apollo Client makes a request, like middleware for the outbound network requests.
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';

//* establish a new link to the GraphQL ---SERVER (port 3001)--- at its /graphql endpoint
const httpLink = createHttpLink({
   uri: '/graphql',
});
//* use ApolloClient() constructor to instantiate the Apollo Client and create the connection to the API endpoint
const client = new ApolloClient({
   link: httpLink,
   cache: new InMemoryCache(), //* instantiate cache
});

function App() {
   //* Use '<ApolloProvider client={client}>' to enable the Apollo Client instance to interact with the entire app
   //* we wrap the entire returning JSX code with <ApolloProvider>. Because we're passing the client variable in as the value
   //* for the client prop in the provider, everything between the JSX tags will eventually have access to the server's API
   //* data through the client we set up.
   return (
      <ApolloProvider client={client}>
         <div className='flex-column justify-flex-start min-100-vh'>
            <Header />
            <div className='container'>
               <Home />
            </div>
            <Footer />
         </div>
      </ApolloProvider>
   );
}

export default App;
