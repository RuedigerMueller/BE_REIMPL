import { Role } from '../roles/entities/role.entity';
import { RoleEnum } from '../roles/roles.enum';
import { User } from './entities/user.entity';

function createUser(
  id: number,
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  email: string,
  roles: Array<Role>,
): User {
  const user: User = new User();
  user.id = id;
  user.username = username;
  user.password = password;
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.roles = roles;
  return user;
}

export let initialUserRepository: ReadonlyArray<User> = [];

const userRole: Role = new Role();
userRole.id = 1;
userRole.role = RoleEnum.User;

const userRoles: Array<Role> = [];
userRoles.push(userRole);

const adminRole: Role = new Role();
adminRole.id = 2;
adminRole.role = RoleEnum.Admin;
const adminRoles: Array<Role> = [];
adminRoles.push(adminRole);
adminRoles.push(userRole);

initialUserRepository = initialUserRepository.concat(
  // plaintext password changeme
  createUser(
    1,
    'Admin',
    '$2b$10$evxpiSvr1wYKA.m3srNLq..wztoyfIPywlEkFpZBnXeqA3zkW7KRS',
    'unknown',
    'unknown',
    'admin@example.com',
    adminRoles,
  ),
);

initialUserRepository = initialUserRepository.concat(
  // plaintext password changeme
  createUser(
    2,
    'john',
    '$2b$10$evxpiSvr1wYKA.m3srNLq..wztoyfIPywlEkFpZBnXeqA3zkW7KRS',
    'John',
    'Miller',
    'john@example.com',
    userRoles,
  ),
);
initialUserRepository = initialUserRepository.concat(
  // plaintext password changeme
  createUser(
    3,
    'chris',
    '$2b$10$evxpiSvr1wYKA.m3srNLq..wztoyfIPywlEkFpZBnXeqA3zkW7KRS',
    'Chris',
    'Myres',
    'chris@example.com',
    userRoles,
  ),
);
initialUserRepository = initialUserRepository.concat(
  // plaintext password changeme
  createUser(
    4,
    'maria',
    '$2b$10$evxpiSvr1wYKA.m3srNLq..wztoyfIPywlEkFpZBnXeqA3zkW7KRS',
    'Maria',
    'Muller',
    'maria@example.com',
    userRoles,
  ),
);

export const admin: User = initialUserRepository.find((user) => user.id === 1);
export const user_1: User = initialUserRepository.find((user) => user.id === 2);
export const user_2: User = initialUserRepository.find((user) => user.id === 3);

export const addUser_1: User = createUser(
  5,
  'paula',
  'special',
  'Paula',
  'Paulsen',
  'paula@example.com',
  userRoles,
);

export const addUser_2: User = createUser(
  6,
  'paul',
  'special',
  'Paul',
  'Paulsen',
  'paul@example.com',
  userRoles,
);
