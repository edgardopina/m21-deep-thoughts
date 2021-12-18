import React from 'react';
import { useParams } from 'react-router-dom'; //* React Hook to parse parameters from the URL

const SingleThought = (props) => {
   const { id: toughtId } = useParams();
   return (
      <div>
         <div className='card mb-3'>
            <p className='card-header'>
               <span style={{ fontWeight: 700 }} className='text-light'>
                  Username
               </span>{' '}
               thought on createdAt
            </p>
            <div className='card-body'>
               <p>Thought Text</p>
            </div>
         </div>
      </div>
   );
};

export default SingleThought;
