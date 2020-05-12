/**
 * FAKE DATABASE
 */

const users = [
  {
    id: '1',
    firstName: 'Maurice',
    lastName: 'Moss',
    email: 'maurice@moss.com',
    password: 'abcdefg',
  },
  {
    id: '2',
    firstName: 'Roy',
    lastName: 'Trenneman',
    email: 'roy@trenneman.com',
    password: 'imroy',
  },
  {
    id: '3',
    firstName: 'Seb',
    lastName: 'Le boss',
    email: 'seb@test.com',
    password: '654321',
  },
];

export default {
  getUsers: () => users,
  addUser: (user) => users.push(user),
};
