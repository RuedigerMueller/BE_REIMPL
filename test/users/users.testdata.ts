import {
  adminRole,
  userRole_2,
  userRole_3,
  userRole_4,
  userRole_5,
  userRole_6,
} from '../roles/roles.testdata';
import { User } from '../../src/users/entities/user.entity';

export const initialUserRepository: Array<User> = [
  // clear text password is 'changeme'
  {
    id: 1,
    username: 'Admin',
    password: '$2b$10$evxpiSvr1wYKA.m3srNLq..wztoyfIPywlEkFpZBnXeqA3zkW7KRS',
    firstName: 'unknonw',
    lastName: 'unknown',
    email: 'unknown@example.com',
    roles: adminRole,
  },
  {
    id: 2,
    username: 'john',
    password: '$2b$10$evxpiSvr1wYKA.m3srNLq..wztoyfIPywlEkFpZBnXeqA3zkW7KRS',
    firstName: 'John',
    lastName: 'Miller',
    email: 'john@example.com',
    roles: userRole_2,
  },
  {
    id: 3,
    username: 'chris',
    password: '$2b$10$evxpiSvr1wYKA.m3srNLq..wztoyfIPywlEkFpZBnXeqA3zkW7KRS',
    firstName: 'Chris',
    lastName: 'Myres',
    email: 'chris@example.com',
    roles: userRole_3,
  },
  {
    id: 4,
    username: 'maria',
    password: '$2b$10$evxpiSvr1wYKA.m3srNLq..wztoyfIPywlEkFpZBnXeqA3zkW7KRS',
    firstName: 'Maria',
    lastName: 'Muller',
    email: 'maria@example.com',
    roles: userRole_4,
  },
];

export const admin: User = initialUserRepository.find((user) => user.id === 1);
export const user_1: User = initialUserRepository.find((user) => user.id === 2);
export const user_2: User = initialUserRepository.find((user) => user.id === 3);
export const user_3: User = initialUserRepository.find((user) => user.id === 4);

export const addUser_1: User = {
  id: 5,
  username: 'paula',
  password: 'changeme',
  firstName: 'Paula',
  lastName: 'Paulsen',
  email: 'paula@example.com',
  roles: userRole_5,
};

export const addUser_2: User = {
  id: 6,
  username: 'paul',
  password: 'changeme',
  firstName: 'Paul',
  lastName: 'Paulsen',
  email: 'paula@example.com',
  roles: userRole_6,
};
