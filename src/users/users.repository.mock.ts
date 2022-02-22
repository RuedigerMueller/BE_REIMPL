import { DeleteResult } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { RoleEnum } from '../roles/roles.enum';
import { User } from './entities/user.entity';
import { addUser_1, initialUserRepository } from './users.testdata';

export class UserRepositoryMock {
  private userRepository: ReadonlyArray<User> = [];

  constructor() {
    this.userRepository = this.userRepository.concat(initialUserRepository);
  }

  getIDfromQuery(query: string): number {
    // { where: { id: '0', username: 'john' } }
    const conditions: string = query['where'];
    return parseInt(conditions['id']);
  }

  geteMailfromQuery(query: string): string {
    // { where: { id: '0', username: 'john' } }
    const conditions: string = query['where'];
    return conditions['email'];
  }

  getUsernamefromQuery(query: string): string {
    // { where: { id: '0', username: 'john' } }
    const conditions: string = query['where'];
    return conditions['username'];
  }

  async save(user: User): Promise<User> {
    if (user.id === undefined) {
      const userRole: Role = new Role();
      userRole.id = 1;
      userRole.role = RoleEnum.User;

      const userRoles: Array<Role> = [];
      userRoles.push(userRole);
      user.id = addUser_1.id;
      user.roles = userRoles;
      this.userRepository = this.userRepository.concat(user);
    }
    return user;
  }

  async findOne(criteria: string): Promise<User> {
    const id: number = this.getIDfromQuery(criteria);
    const email: string = this.geteMailfromQuery(criteria);
    const username: string = this.getUsernamefromQuery(criteria);
    if (email) {
      return this.userRepository.find((user) => user.email === email);
    } else if (id) {
      return this.userRepository.find((user) => user.id === id);
    } else if (username) {
      return this.userRepository.find((user) => user.username === username);
    } else {
      return null;
    }
  }

  async find(): Promise<User[]> {
    let result: User[] = [];
    result = result.concat(this.userRepository);
    return Promise.resolve(result);
  }

  async delete(id: number): Promise<DeleteResult> {
    const result: DeleteResult = {
      raw: [],
      affected: 0,
    };

    if (this.userRepository.find((user) => user.id === id) !== undefined) {
      result.affected = 1;
    }
    return Promise.resolve(result);
  }
}
