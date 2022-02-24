import {
  addUser_1,
  addUser_2,
  admin,
  user_1,
  user_2,
  user_3,
} from '../users/users.testdata';
import { Role } from '../../src/roles/entities/role.entity';
import { RoleEnum } from '../../src/roles/roles.enum';

export const adminRole: Array<Role> = [
  { id: 1, role: RoleEnum.Admin, user: admin },
  { id: 2, role: RoleEnum.User, user: admin },
];

export const userRole_2: Array<Role> = [
  { id: 3, role: RoleEnum.User, user: user_1 },
];

export const userRole_3: Array<Role> = [
  { id: 4, role: RoleEnum.User, user: user_2 },
];

export const userRole_4: Array<Role> = [
  { id: 5, role: RoleEnum.User, user: user_3 },
];

export const userRole_5: Array<Role> = [
  { id: 6, role: RoleEnum.User, user: addUser_1 },
];

export const userRole_6: Array<Role> = [
  { id: 7, role: RoleEnum.User, user: addUser_2 },
];
