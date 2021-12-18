import React from 'react';

//! import useQuery HOOK o make requests to the GraphQL server we connected to and made available to the application
//! using the < ApolloProvider > component in App.js
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS } from '../utils/queries';
import ThoughtList from '../components/ThoughtList';

const Home = () => {
   //* use useQuery hook to make query request;
   //* useQuery is asynchronous, just like using fetch(). @apollo/client library provide 'loading' and 'data properties

   //* loading - indicates that the request isn't done just yet.
   //* data - when the request is finished the data returned from the server is stored in the destructured 'data' property.

   //* the the loading property, will enable us to conditionally render data based on whether or not there is data to even display.
   const { loading, data } = useQuery(QUERY_THOUGHTS);

   //* we use 'optional chaining (?.)' (browser side ONLY) TO CHECK IF A PROPERTY IS NOT NULLish (null or undefined)
   //* EQUIVALENT: if(data.thoughts) {const thoughts = data.thoughts} else {const thoughts = []};
   const thoughts = data?.thoughts || [];

   return (
      <main>
         <div className='flex-row justify-space-between'>
            <div className='col-12 mb-3'>
               {loading ? (
                  <div>Loading...</div>
               ) : (
                  <ThoughtList thoughts={thoughts} title='Some Feed for Thought(s)...' />
               )}
            </div>
         </div>
      </main>
   );
};

export default Home;
