import { gql } from 'apollo-boost';

export const SIGNUP_MUTATION = gql`
  mutation Signup(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    signup(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const LOGOUT_MUTATON = gql`
  mutation Logout {
    logout
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;
