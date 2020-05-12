import uuid from 'uuid/v4';

const resolvers = {
  Query: {
    currentUser: (parent, args, context) => context.getUser(),
  },
  Mutation: {
    /**
     * check if there is already a user with this email.
     * if not, create new user, add to DB, and login
     */
    signup: async (
      parent,
      { firstName, lastName, email, password },
      context
    ) => {
      const existingUsers = context.User.getUsers();
      const userWithEmailAlreadyExists = !!existingUsers.find(
        (user) => user.email === email
      );

      if (userWithEmailAlreadyExists) {
        throw new Error('User with email already exists');
      }

      const newUser = {
        id: uuid(),
        firstName,
        lastName,
        email,
        password,
      };

      context.User.addUser(newUser);

      // if we need to automatic login the new created user
      await context.login(newUser);

      return { user: newUser };
    },

    login: async (parent, { email, password }, context) => {
      const { user } = await context.authenticate('graphql-local', {
        email,
        password,
      });
      await context.login(user);
      return { user };
    },

    logout: (parent, args, context) => context.logout(),
  },
};

export default resolvers;
