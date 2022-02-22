import { Role } from './entities/role.entity';

export class RoleRepositoryMock {
  private rolesRepository: ReadonlyArray<Role> = [];

  constructor() {
    this.rolesRepository = []; //this.rolesRepository.concat(initialRolesRepository);
  }

  async save(role: Role): Promise<Role> {
    /* if (user.id === undefined) {
          user.id = addUser_1.id;
          this.userRepository = this.userRepository.concat(user);
        } */
    return role;
  }
}
