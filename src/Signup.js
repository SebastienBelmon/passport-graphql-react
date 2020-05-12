import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { CURRENT_USER_QUERY } from './queries';
import { SIGNUP_MUTATION } from './mutations';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [signup] = useMutation(
    SIGNUP_MUTATION,
    // update the authed user with apollo store update
    {
      update: (cache, { data: { signup } }) =>
        cache.writeQuery({
          query: CURRENT_USER_QUERY,
          data: { currentUser: signup.user },
        }),
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      firstName,
      lastName,
      email,
      password,
    };

    signup({ variables: user });
  };

  return (
    <React.Fragment>
      <h2>Signup form</h2>
      <form onSubmit={handleSubmit}>
        {/* FIRSTNAME */}
        <div>
          <label htmlFor="firstName">FirstName</label>
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        {/* LASTNAME */}
        <div>
          <label htmlFor="lastName">LastName</label>
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

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
        <button type="submit">Sign up</button>
      </form>
    </React.Fragment>
  );
};

export default Signup;
