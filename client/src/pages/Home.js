import React from 'react';

//! import useQuery HOOK o make requests to the GraphQL server we connected to and made available to the application
//! using the < ApolloProvider > component in App.js
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
import ThoughtList from '../components/ThoughtList';
import Auth from '../utils/auth'; //! to check the logged-in status of a USER
import FriendList from '../components/FriendList';
import ThoughtForm from '../components/ThoughtForm';

const Home = () => {
   //! use useQuery() hook to make query request;
   //* useQuery is asynchronous, just like using fetch(). @apollo/client library provide 'loading' and 'data properties
   //* loading - indicates that the request isn't done just yet.
   //* data - when the request is finished the data returned from the server is stored in the destructured 'data' property.
   //* the the loading property, will enable us to conditionally render data based on whether or not there is data to even display.
   const { loading, data } = useQuery(QUERY_THOUGHTS);

   //* use object destructuring to extract `data` from the `useQuery` Hook's response and rename it `userData` to be more descriptive
   const { data: userData } = useQuery(QUERY_ME_BASIC);
   console.log('🚀 ~ file: Home.js ~ line 21 ~ Home ~ userData', userData);

   //* we use 'optional chaining (?.)' (browser side ONLY) TO CHECK IF A PROPERTY IS NOT NULLish (null or undefined)
   //* EQUIVALENT: if(data.thoughts) {thoughts = data.thoughts} else { thoughts = []};
   const thoughts = data?.thoughts || [];

   const loggedIn = Auth.loggedIn();

   //* if the user is logged in, it'll only span eight columns
   //* if the user is logged in, it'll render the ThoughtForm component
   return (
      <main>
         <div className='flex-row justify-space-between'>
            {loggedIn && (
               <div className='col-12 mb-3'>
                  <ThoughtForm />
               </div>
            )}
            <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
               {loading ? (
                  <div>Loading...</div>
               ) : (
                  <ThoughtList thoughts={thoughts} title='Some Feed for Thought(s)...' />
               )}
            </div>
            {loggedIn && userData ? (
               <div className='col-12 col-lg-3 mb-3'>
                  <FriendList
                     friendCount={userData.me.friendCount}
                     username={userData.me.username}
                     friends={userData.me.friends}
                  />
               </div>
            ) : null}
         </div>
      </main>
   );
};

export default Home;
