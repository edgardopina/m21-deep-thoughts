const { User, Thought } = require('../models'); //* import models

//! the resolvers' names are the same names of the query or mutation that they are resolvers for
//* there are FOUR parameters that can be passed throug in each query
//* 1. parent - This is if we used nested resolvers to handle more complicated actions, as it would hold the reference
//*             to the resolver that executed the nested resolver function. We won't need this throughout the project,
//*             but we need to include it as the first argument.
//* 2. args - This is an object of all of the values passed into a query or mutation request as parameters. In our
//*           case, we destructure the username parameter out to be used.
//* 3. context - This will come into play later. If we were to need the same data to be accessible by all resolvers,
//*              such as a logged -in user's status or API access token, this data will come through this context
//*              parameter as an object.
//* 4. info - This will contain extra information about an operation's current state. This isn't used as frequently,
//*           but it can be implemented for more advanced uses.
const resolvers = {
   Query: {
      //* GET all users
      users: async () => {
         return User.find() //
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
      },
      //* GET one user by username
      user: async (parent, { username }) => {
         return User.findOne({ username }) //
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
      },
      //* GET all thoughts of an username or ALL thoughts of all usernames
      thoughts: async (parent, { username }) => {
         const params = username ? { username } : {};
         return Thought.find(params).sort({ createdAt: -1 });
      },
      //* GET one thoughts by user _id
      thought: async (parent, { _id }) => {
         return Thought.findOne({ _id });
      },
   },
};

module.exports = resolvers;
