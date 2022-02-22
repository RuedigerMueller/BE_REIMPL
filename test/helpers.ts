import { Role } from '../src/roles/entities/role.entity';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { ReadUserDto } from '../src/users/dto/read-user.dto';
import { User } from '../src/users/entities/user.entity';

export function user2readUserDto(user: User) {
  const roles: Array<string> = [];
  user.roles.forEach((role: Role) => {
    roles.push(role.role);
  });

  const foundUser: ReadUserDto = {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    roles: roles,
  };
  return foundUser;
}

export function user2createUserDto(user: User) {
  const createUserDto: CreateUserDto = {
    email: user.email,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
  };
  return createUserDto;
}
