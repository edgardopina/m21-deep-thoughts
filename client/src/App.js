import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; //* React router


//* ApolloProvider - is a special type of React component that we'll use to provide data to all of the other components.
//* ApolloClient - is a constructor function that will help initialize the connection to the GraphQL API server.
//* InMemoryCache - enables the Apollo Client to cache API response data so that perform requests run more efficiently.
//* createHttpLink - enables to control how the Apollo Client makes a request, like middleware for the outbound network requests.
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

//* create a 'middleware' function that will retrieve the JWT token (authLink) for us and combine it with the existing httpLink
import { setContext } from '@apollo/client/link/context';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';

//* establish a new link to the GraphQL ---SERVER (port 3001)--- at its /graphql endpoint
const httpLink = createHttpLink({
   uri: '/graphql',
});

//* With the configuration of authLink, we use the setContext() function to retrieve the token from localStorage and
//* set the HTTP request headers of every request to include the token, whether the request needs it or not. This is
//* fine, because if the request doesn't need the token, our server-side resolver function won't check for it.
//*
//* We wont use the first parameter of setContext(), which stores the current request object in case this function
//* is running after we've initiated a request. Because we're not using the first parameter, but we still need to
//* access the second one, we can use an underscore _ to serve as a placeholder for the first parameter.
const authLink = setContext((_, { headers }) => {
   const token = localStorage.getItem('id_token');
   return {
      headers: {
         ...headers,
         authorization: token ? `Bearer ${token}` : '',
      },
   };
});

//* use ApolloClient() constructor to instantiate the Apollo Client and create the connection to the API endpoint
//*
//* link: authLink.concat(httpLink) - combine the authLink and httpLink objects so that every request retrieves the
//* token and sets the request headers before making the request to the API. With this in place, this in place, we
//* won't have to worry about doing this manually with every single request. It'll just do it for us.
const client = new ApolloClient({
   link: authLink.concat(httpLink),
   cache: new InMemoryCache(), //* instantiate cache
});

function App() {
   //* Use '<ApolloProvider client={client}>' to enable the Apollo Client instance to interact with the entire app
   //* we wrap the entire returning JSX code with <ApolloProvider>. Because we're passing the client variable in as the value
   //* for the client prop in the provider, everything between the JSX tags will eventually have access to the server's API
   //* data through the client we set up.
   return (
      <ApolloProvider client={client}>
         <Router>
            <div className='flex-column justify-flex-start min-100-vh'>
               <Header />
               <div className='container'>
                  <Switch>
                     <Route exact path='/' component={Home} />
                     <Route exact path='/login' component={Login} />
                     <Route exact path='/signup' component={Signup} />
                     {/* '/:username?' - question mark indicates that this partameters is OPTIONAL */}
                     <Route exact path='/profile/:username?' component={Profile} />
                     <Route exact path='/thought/:id' component={SingleThought} />

                     <Route component={NoMatch} />
                  </Switch>
               </div>
               <Footer />
            </div>
         </Router>
      </ApolloProvider>
   );
}

export default App;

