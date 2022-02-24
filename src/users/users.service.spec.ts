import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { user2createUserDto, user2readUserDto } from './dto/user.dto.helpers';
import { Role } from '../roles/entities/role.entity';
import { RoleRepositoryMock } from '../roles/roles.repository.mock';
import { CreateUserDto } from './dto/create-user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepositoryMock } from './users.repository.mock';
import { UsersService } from './users.service';
import {
  addUser_1,
  addUser_2,
  initialUserRepository,
  user_1,
} from './users.testdata';

describe('UsersService', () => {
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: UserRepositoryMock,
        },
        {
          provide: getRepositoryToken(Role),
          useClass: RoleRepositoryMock,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a user with ID', async () => {
      const expected_result: ReadUserDto = user2readUserDto(addUser_1);
      const createUserDto: CreateUserDto = user2createUserDto(addUser_1);

      await userService.create(createUserDto);

      expect(await userService.findByEmail(createUserDto.email)).toEqual(
        expected_result,
      );
    });

    it('should not create a user when data is missing', async () => {
      const createUserDto: CreateUserDto = user2createUserDto(addUser_2);
      createUserDto.username = '';
      await expect(userService.create(createUserDto)).rejects.toThrow();

      createUserDto.username = addUser_2.username;
      createUserDto.email = '';
      await expect(userService.create(createUserDto)).rejects.toThrow();

      createUserDto.email = addUser_2.email;
      createUserDto.firstName = '';
      await expect(userService.create(createUserDto)).rejects.toThrow();

      createUserDto.firstName = addUser_2.firstName;
      createUserDto.lastName = '';
      await expect(userService.create(createUserDto)).rejects.toThrow();

      createUserDto.lastName = addUser_2.lastName;
      createUserDto.password = '';
      await expect(userService.create(createUserDto)).rejects.toThrow();
    });

    it('should not create a user when e-mail is already taken', async () => {
      const createUserDto: CreateUserDto = user2createUserDto(addUser_1);
      createUserDto.email = user_1.email;
      await expect(userService.create(createUserDto)).rejects.toThrow();
    });
  });

  describe('findByID', () => {
    it('should find a user with an existing ID', async () => {
      const expected_user: ReadUserDto = user2readUserDto(user_1);
      expect(await userService.findByID(user_1.id)).toEqual(expected_user);
    });

    it('should not find a user with a not existing ID', async () => {
      await expect(userService.findByID(4711)).rejects.toThrow();
    });
  });

  describe('findByEmail', () => {
    it('should find a user with an existing ID', async () => {
      const expected_user: ReadUserDto = user2readUserDto(user_1);
      expect(await userService.findByEmail(user_1.email)).toEqual(
        expected_user,
      );
    });

    it('should not find a user with a not existing ID', async () => {
      await expect(userService.findByEmail('x.y@a.com')).rejects.toThrow();
    });
  });

  describe('findByUsername', () => {
    it('should find a user with an existing username', async () => {
      const expected_user: ReadUserDto = user2readUserDto(user_1);
      expect(await userService.findByUsername(user_1.username)).toEqual(
        expected_user,
      );
    });

    it('should not find a user with a not existing username', async () => {
      await expect(
        userService.findByUsername('notexistingusername'),
      ).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all the users in the repository', async () => {
      let expected_users: ReadUserDto[] = [];
      initialUserRepository.forEach((user) => {
        const readUserDto: ReadUserDto = user2readUserDto(user);
        expected_users = expected_users.concat(readUserDto);
      });
      expect(await userService.findAll()).toEqual(expected_users);
    });
  });

  describe('update', () => {
    it('should update a user with ID', async () => {
      const expected_user: ReadUserDto = user2readUserDto(user_1);
      expected_user.firstName = 'Updated';
      expected_user.lastName = 'Updated';

      const userDto: UpdateUserDto = {
        firstName: 'Updated',
        lastName: 'Updated',
        password: 'Updated',
      };
      expect(await userService.update(user_1.id, userDto)).toEqual(
        expected_user,
      );
    });

    it('should not update a user with invalid ID', async () => {
      const userDto: UpdateUserDto = {
        firstName: 'Updated',
        lastName: 'Updated',
        password: 'Updated',
      };
      await expect(userService.update(4711, userDto)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove a user with a valid ID', async () => {
      await expect(userService.remove(user_1.id)).resolves.toBeUndefined();
    });

    it('should remove a user with a valid ID', async () => {
      await expect(userService.remove(4711)).rejects.toThrow();
    });
  });

  describe('validateUser', () => {
    it('should return user for a matching password', async () => {
      const expected_user: ReadUserDto = user2readUserDto(user_1);
      expect(
        await userService.validateUser(user_1.username, 'changeme'),
      ).toEqual(expected_user);
    });

    it('should return undefined for a not matching password', async () => {
      expect(
        await userService.validateUser(user_1.username, 'wrongpassword'),
      ).toEqual(undefined);
    });
  });
});
