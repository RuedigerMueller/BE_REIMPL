import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
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
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a user with ID', async () => {
      const expected_result: ReadUserDto = {
        id: addUser_1.id,
        email: addUser_1.email,
        firstName: addUser_1.firstName,
        lastName: addUser_1.lastName,
        username: addUser_1.username,
      };
      const createUserDto: CreateUserDto = {
        email: addUser_1.email,
        password: addUser_1.password,
        firstName: addUser_1.firstName,
        lastName: addUser_1.lastName,
        username: addUser_1.username,
      };

      await userService.create(createUserDto);
      expect(await userService.findByEmail(createUserDto.email)).toEqual(
        expected_result,
      );
    });

    it('should not create a user when data is missing', async () => {
      const createUserDto: CreateUserDto = {
        email: addUser_2.email,
        password: addUser_2.password,
        firstName: addUser_2.firstName,
        lastName: addUser_2.lastName,
        username: addUser_2.username,
      };
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
      const createUserDto: CreateUserDto = {
        email: addUser_1.email,
        password: addUser_1.password,
        firstName: addUser_1.firstName,
        lastName: addUser_1.lastName,
        username: addUser_1.username,
      };
      createUserDto.email = user_1.email;
      await expect(userService.create(createUserDto)).rejects.toThrow();
    });
  });

  describe('findByID', () => {
    it('should find a user with an existing ID', async () => {
      const expected_user: ReadUserDto = {
        id: user_1.id,
        email: user_1.email,
        firstName: user_1.firstName,
        lastName: user_1.lastName,
        username: user_1.username,
      };
      expect(await userService.findByID(user_1.id)).toEqual(expected_user);
    });

    it('should not find a user with a not existing ID', async () => {
      await expect(userService.findByID(4711)).rejects.toThrow();
    });
  });

  describe('findByEmail', () => {
    it('should find a user with an existing ID', async () => {
      const expected_user: ReadUserDto = {
        id: user_1.id,
        email: user_1.email,
        firstName: user_1.firstName,
        lastName: user_1.lastName,
        username: user_1.username,
      };
      expect(await userService.findByEmail(user_1.email)).toEqual(
        expected_user,
      );
    });

    it('should not find a user with a not existing ID', async () => {
      await expect(userService.findByEmail('x.y@a.com')).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all the users in the repository', async () => {
      let expected_users: ReadUserDto[] = [];
      initialUserRepository.forEach((user) => {
        const readUserDto: ReadUserDto = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
        };
        expected_users = expected_users.concat(readUserDto);
      });
      expect(await userService.findAll()).toEqual(expected_users);
    });
  });

  describe('update', () => {
    it('should update a user with ID', async () => {
      const expected_user: ReadUserDto = {
        id: user_1.id,
        username: user_1.username,
        firstName: 'Updated',
        lastName: 'Updated',
        email: user_1.email,
      };
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
});
