const { User, Thought } = require('../models'); //* import models

const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

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
      me: async (parent, args, context) => {
         if (context.user) {
            const userData = await User.findOne({}) //
               .select('-__v -password')
               .populate('thoughts')
               .populate('friends');
            return userData;
         }
         throw new AuthenticationError('You are not logged in.');
      },
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
   Mutation: {
      //* add users to database
      addUser: async (parent, args) => {
         const user = await User.create(args); //* create user with Mongoose create(args)
         const token = signToken(user);
         return { token, user };
      },
      //* login resolver
      login: async (parent, { email, password }) => {
         const user = await User.findOne({ email });
         if (!user) {
            throw new AuthenticationError('Incorrect credentials');
         }
         const correctPw = await user.isCorrectPassword(password);
         if (!correctPw) {
            throw new AuthenticationError('Incorrect credentials');
         }
         const token = signToken(user);
         return { token, user };
      },
      //* addThought resolver
      addThought: async (parent, args, context) => {
         //* validates that only logged-in users can use this mutation
         //* the decoded JWT is only added to context if the verification passes. The token includes the user's
         //* username, email, and _id properties, which become properties of context.user
         if (context.user) {
            const thought = await Thought.create({ ...args, username: context.user.username });

            await User.findByIdAndUpdate(
               { _id: context.user._id },
               { $push: { thoughts: thought._id } }, //* thoughts are stored as an array
               { new: true } //* true - ensures that the updated record is returned instead of the old record
            );

            return thought;
         }

         throw new AuthenticationError('You need to be logged in!');
      },
      //* addReaction resolver
      addReaction: async (parent, { thoughtId, reactionBody }, context) => {
         if (context.user) {
            const updatedThought = await Thought.findOneAndUpdate(
               { _id: thoughtId },
               { $push: { reactions: { reactionBody, username: context.user.username } } }, //* thoughts are stored as an array
               { new: true, runValidators: true }
            );

            return updatedThought;
         }

         throw new AuthenticationError('You need to be logged in!');
      },
      //* addFriend resolver
      addFriend: async (parent, { friendId }, context) => {
         if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
               { _id: context.user._id },
               //* A user can't be friends with the same person twice, though, hence why we're using the $addToSet operator 
               //* instead of $push to prevent duplicate entries.
               { $addToSet: { friends: friendId } },
               { new: true }
            ).populate('friends');

            return updatedUser;
         }

         throw new AuthenticationError('You need to be logged in!');
      },
   },
};

module.exports = resolvers;
