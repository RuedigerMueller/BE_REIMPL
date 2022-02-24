import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { MockType } from '../../test/mock.type';
import { Role } from '../roles/entities/role.entity';
import { roleRepositoryMockFactory } from '../roles/roles.repository.mock.factory';
import { CreateUserDto } from './dto/create-user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { user2createUserDto, user2readUserDto } from './dto/user.dto.helpers';
import { User } from './entities/user.entity';
import { userRepositoryMockFactory } from './user.respository.mock.factory';
import { UsersService } from './users.service';
import {
  addUser_1,
  addUser_2,
  initialUserRepository,
  user_1,
} from './users.testdata';

describe('UsersService', () => {
  let userService: UsersService;
  let userRepositoryMock: MockType<Repository<User>>;
  let roleRepositoryMock: MockType<Repository<Role>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: userRepositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Role),
          useFactory: roleRepositoryMockFactory,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepositoryMock = module.get(getRepositoryToken(User));
    roleRepositoryMock = module.get(getRepositoryToken(Role));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a user with ID', async () => {
      const expected_result: ReadUserDto = user2readUserDto(addUser_1);
      const createUserDto: CreateUserDto = user2createUserDto(addUser_1);
      userRepositoryMock.findOne.mockReturnValue(undefined);
      userRepositoryMock.save.mockReturnValue(addUser_1);
      userRepositoryMock.findByIds.mockReturnValue([addUser_1]);
      roleRepositoryMock.save.mockReturnValue(true);

      await userService.create(createUserDto);

      userRepositoryMock.findOne.mockReturnValue(addUser_1);

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
      userRepositoryMock.findOne.mockReturnValue(addUser_1);
      const createUserDto: CreateUserDto = user2createUserDto(addUser_1);

      await expect(userService.create(createUserDto)).rejects.toThrow();
    });
  });

  describe('findByID', () => {
    it('should find a user with an existing ID', async () => {
      userRepositoryMock.findByIds.mockReturnValue([user_1]);
      const expected_user: ReadUserDto = user2readUserDto(user_1);

      expect(await userService.findByID(user_1.id)).toEqual(expected_user);
    });

    it('should not find a user with a not existing ID', async () => {
      userRepositoryMock.findOne.mockReturnValue(undefined);
      await expect(userService.findByID(4711)).rejects.toThrow();
    });
  });

  describe('findByEmail', () => {
    it('should find a user with an existing ID', async () => {
      userRepositoryMock.findOne.mockReturnValue(user_1);
      const expected_user: ReadUserDto = user2readUserDto(user_1);

      expect(await userService.findByEmail(user_1.email)).toEqual(
        expected_user,
      );
    });

    it('should not find a user with a not existing ID', async () => {
      userRepositoryMock.findOne.mockReturnValue(undefined);

      await expect(userService.findByEmail('x.y@a.com')).rejects.toThrow();
    });
  });

  describe('findByUsername', () => {
    it('should find a user with an existing username', async () => {
      userRepositoryMock.findOne.mockReturnValue(user_1);
      const expected_user: ReadUserDto = user2readUserDto(user_1);

      expect(await userService.findByUsername(user_1.username)).toEqual(
        expected_user,
      );
    });

    it('should not find a user with a not existing username', async () => {
      userRepositoryMock.findOne.mockReturnValue(undefined);

      await expect(
        userService.findByUsername('notexistingusername'),
      ).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all the users in the repository', async () => {
      userRepositoryMock.find.mockReturnValue(initialUserRepository);
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
      const update = 'Updated';
      const dummyUser: User = {
        ...user_1,
        firstName: update,
        lastName: update,
        password: update,
      };

      userRepositoryMock.save.mockReturnValue(dummyUser);
      userRepositoryMock.findOne.mockReturnValue(user_1);

      const expected_user: ReadUserDto = user2readUserDto(user_1);
      expected_user.firstName = update;
      expected_user.lastName = update;

      const userDto: UpdateUserDto = {
        firstName: update,
        lastName: update,
        password: update,
      };
      expect(await userService.update(user_1.id, userDto)).toEqual(
        expected_user,
      );
    });

    it('should not update a user with invalid ID', async () => {
      userRepositoryMock.findOne.mockReturnValue(undefined);
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
      const deleteResult: DeleteResult = {
        affected: 1,
        raw: 'rawData',
      };
      userRepositoryMock.delete.mockReturnValue(deleteResult);

      await expect(userService.remove(user_1.id)).resolves.toBeUndefined();
    });

    it('should throw in case of invalid ID', async () => {
      const deleteResult: DeleteResult = {
        affected: 0,
        raw: 'rawData',
      };
      userRepositoryMock.delete.mockReturnValue(deleteResult);

      await expect(userService.remove(4711)).rejects.toThrow();
    });
  });

  describe('validateUser', () => {
    it('should return user for a matching password', async () => {
      userRepositoryMock.findOne.mockReturnValue(user_1);
      const expected_user: ReadUserDto = user2readUserDto(user_1);

      expect(
        await userService.validateUser(user_1.username, 'changeme'),
      ).toEqual(expected_user);
    });

    it('should return undefined for a not matching password', async () => {
      userRepositoryMock.findOne.mockReturnValue(user_1);

      expect(
        await userService.validateUser(user_1.username, 'wrongpassword'),
      ).toEqual(undefined);
    });
  });
});
