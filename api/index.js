import express from 'express';
import session from 'express-session';
import uuid from 'uuid/v4';
import dotenv from 'dotenv';

import passport from 'passport';
import User from './User'; // fake DB

import { ApolloServer } from 'apollo-server-express';
import typeDefs from './typeDefs';
import resolvers from './resolvers';

// allow using environment vars in .env file
dotenv.config();

// CONSTANTS
const PORT = 4000;

// PASSPORT CONFIGS

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

// EXPRESS MIDDLEWARE
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
  context: ({ req }) => ({
    getUsers: () => req.user,
    logout: () => req.logout(),
  }),
});

server.applyMiddleware({ app });

// START SERVER
app.listen({ port: PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
