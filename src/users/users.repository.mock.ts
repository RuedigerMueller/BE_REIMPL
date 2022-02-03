import { DeleteResult } from 'typeorm';
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

  async save(user: User): Promise<User> {
    if (user.id === undefined) {
      user.id = addUser_1.id;
      this.userRepository = this.userRepository.concat(user);
    }
    return user;
  }

  async findOne(criteria: string): Promise<User> {
    const id: number = this.getIDfromQuery(criteria);
    const email: string = this.geteMailfromQuery(criteria);
    if (email) {
      return this.userRepository.find((user) => user.email === email);
    } else if (id) {
      return this.userRepository.find((user) => user.id === id);
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
      affected: 0
    };
    
    if (this.userRepository.find((user) => user.id === id) !== undefined) {
      result.affected = 1;
    }
    return Promise.resolve(result);
  }
}
