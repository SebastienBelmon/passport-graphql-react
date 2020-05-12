import cors from 'cors';
import express from 'express';
import session from 'express-session';
import uuid from 'uuid/v4';
import dotenv from 'dotenv';

import passport from 'passport';
import { GraphQLLocalStrategy, buildContext } from 'graphql-passport'; // passport start
import User from './User'; // fake DB

import { ApolloServer } from 'apollo-server-express';
import typeDefs from './typeDefs';
import resolvers from './resolvers';

// allow using environment vars in .env file
dotenv.config();

// CONSTANTS
const PORT = 4000;

// PASSPORT CONFIGS
passport.use(
  new GraphQLLocalStrategy((email, password, done) => {
    const users = User.getUsers();
    const matchingUser = users.find(
      (user) => email === user.email && password === user.password
    );
    const error = matchingUser ? null : new Error('no matching user');

    done(error, matchingUser);
  })
);

/**
 * Save user ID to the session
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * Get user's data back by search all users by ID
 */
passport.deserializeUser((id, done) => {
  const users = User.getUsers();
  const matchingUser = users.find((user) => user.id === id);

  done(null, matchingUser);
});

// EXPRESS
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

// EXPRESS MIDDLEWARE
//! By default, apollo-server-express overwrites the CORS
//! settings defined by the middleware below. need to set cors: false
//! when calling applyMiddleware.
app.use(cors(corsOptions));
app.use(
  session({
    genid: (req) => uuid(),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    //TODO IN PROD
    //? only send cookie via https
    // cookie: {
    //   secure: true
    // }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ApolloSERVER
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // to add the new user to the list of existing ones we will need
  // to access the User model from the resolvers
  context: ({ req, res }) => buildContext({ req, res, User }),
});

server.applyMiddleware({ app, cors: false });

// START SERVER
app.listen({ port: PORT }, () => {
  console.log(`Server ready at http://localhost:${PORT}/graphql`);
});
