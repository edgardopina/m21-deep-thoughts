//! This file will store all of the GraphQL query requests
import { gql } from '@apollo/client';

//* we can import this query function by name and use it anywhere we need throughout the front end of the application.
export const QUERY_THOUGHTS = gql`
   query thoughts($username: String) {
      thoughts(username: $username) {
         _id
         thoughtText
         createdAt
         username
         reactionCount
         reactions {
            _id
            createdAt
            username
            reactionBody
         }
      }
   }
`;
