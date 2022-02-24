import { Role } from "./entities/role.entity";
import { RoleEnum } from "./roles.enum";

export const adminRoles: Array<Role> = [];
export const userRoles: Array<Role> = [];

const userRole: Role = new Role();
userRole.id = 1;
userRole.role = RoleEnum.User;
userRoles.push(userRole);

const adminRole: Role = new Role();
adminRole.id = 2;
adminRole.role = RoleEnum.Admin;
adminRoles.push(adminRole);
adminRoles.push(userRole);