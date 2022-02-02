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
  createUser(1, 'john', 'changeme', 'John', 'Miller', 'john@example.com'),
);
initialUserRepository = initialUserRepository.concat(
  createUser(2, 'chris', 'secret', 'Chris', 'Myres', 'chris@example.com'),
);
initialUserRepository = initialUserRepository.concat(
  createUser(3, 'maria', 'guess', 'Maria', 'Muller', 'maria@example.com'),
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
