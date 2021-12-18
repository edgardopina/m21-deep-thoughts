//! Creating the component in an index.js file, we can simply use the import statement to look for
//! './components/ThoughtList' instead of './components/ThoughtList/ThoughtList.js'. Although this is just a common
//! organizational pattern, ultimately we can organize our components and files however we feel comfortable.

import React from 'react';
import { Link } from 'react-router-dom';

//* ThoughtList component
const ThoughtList = ({ thoughts, title }) => {
   if (!thoughts.length) {
      return <h3>No Thoughts Found Yet</h3>;
   }
   //* the key attribute in '<div key={thought._id} clas....' helps React internally track which data needs to be
   //* re - rendered if something changes.
   return (
      <div>
         <h3>{title}</h3>
         {thoughts &&
            thoughts.map((thought) => (
               <div key={thought._id} className='card mb-3'>
                  <p className='card-header'>
                     <Link to={`/profile/${thought.username}`} style={{ fontWeight: 700 }} className='text-light'>
                        {thought.username}
                     </Link>{' '}
                     thought on {thought.createdAt}
                  </p>
                  <div className='card-body'>
                     <Link to={`/thought/${thought._id}`}>
                        <p>{thought.thoughtText}</p>
                        <p className='mb-0'>
                           Reactions: {thought.reactionCount} || Click to {thought.reactionCount ? 'see' : 'start'} the
                           discussion!
                        </p>
                     </Link>
                  </div>
               </div>
            ))}
      </div>
   );
};

export default ThoughtList;
