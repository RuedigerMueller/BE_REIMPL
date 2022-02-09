import { User } from './entities/user.entity';

function createUser(
  id: number,
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  email: string,
): User {
  const user: User = new User();
  user.id = id;
  user.username = username;
  user.password = password;
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  return user;
}

export let initialUserRepository: ReadonlyArray<User> = [];

initialUserRepository = initialUserRepository.concat(
  // plaintext password changeme
  createUser(
    1,
    'john',
    '$2b$10$evxpiSvr1wYKA.m3srNLq..wztoyfIPywlEkFpZBnXeqA3zkW7KRS',
    'John',
    'Miller',
    'john@example.com',
  ),
);
initialUserRepository = initialUserRepository.concat(
  // plaintext password secret
  createUser(
    2,
    'chris',
    '$2b$10$GAbzc2/Z7KcRs5jVmb5gyekjZ5XwjwKRYUgqtbyap2wl3mrq6QQo6',
    'Chris',
    'Myres',
    'chris@example.com',
  ),
);
initialUserRepository = initialUserRepository.concat(
  // plaintext password guess
  createUser(
    3,
    'maria',
    '$2b$10$gKVCHzB5W/fn1cMTYbMV1O.WM/45Vq8tHEGszDhWsR4Px9UL3YP7.',
    'Maria',
    'Muller',
    'maria@example.com',
  ),
);

export const user_1: User = initialUserRepository.find((user) => user.id === 1);
export const user_2: User = initialUserRepository.find((user) => user.id === 2);

export const addUser_1: User = createUser(
  4,
  'paula',
  'special',
  'Paula',
  'Paulsen',
  'paula@example.com',
);

export const addUser_2: User = createUser(
  5,
  'paul',
  'special',
  'Paul',
  'Paulsen',
  'paul@example.com',
);
