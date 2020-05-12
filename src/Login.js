import React, { useState } from 'react';

import { useMutation } from '@apollo/react-hooks';

import { CURRENT_USER_QUERY } from './queries';
import { LOGIN_MUTATION } from './mutations';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [login] = useMutation(LOGIN_MUTATION, {
    update: (cache, { data: { login } }) => {
      cache.writeQuery({
        query: CURRENT_USER_QUERY,
        data: { currentUser: login.user },
      });
    },
  });
  return (
    <React.Fragment>
      <h2>Login Form</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          login({
            variables: {
              email,
              password,
            },
          });
        }}
      >
        {/* EMAIL */}
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </React.Fragment>
  );
};

export default Login;
