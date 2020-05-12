import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import Signup from './Signup';
import Login from './Login';

import { CURRENT_USER_QUERY } from './queries';
import { LOGOUT_MUTATON } from './mutations';

const App = () => {
  const { loading, error, data } = useQuery(CURRENT_USER_QUERY);
  const [logout] = useMutation(LOGOUT_MUTATON, {
    update: (cache) =>
      cache.writeQuery({
        query: CURRENT_USER_QUERY,
        data: { currentUser: null },
      }),
  });

  if (loading) return <div>Loadin</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  const isLoggedIn = !!data.currentUser;

  if (isLoggedIn) {
    const { id, firstName, lastName, email } = data.currentUser;

    return (
      <React.Fragment>
        {id}
        <br />
        {firstName} {lastName}
        <br />
        {email}
        <button onClick={() => logout()}>logout</button>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Signup />
      <Login />
    </React.Fragment>
  );
};

export default App;
