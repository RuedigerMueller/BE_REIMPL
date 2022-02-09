import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UserRepositoryMock } from './users.repository.mock';
import { UsersService } from './users.service';
import { addUser_1, initialUserRepository, user_1 } from './users.testdata';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: UserRepositoryMock,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('create', () => {
    it('should return the data returned by the UsersService', async () => {
      const expected_user: ReadUserDto = {
        id: addUser_1.id,
        email: addUser_1.email,
        firstName: addUser_1.firstName,
        lastName: addUser_1.lastName,
        username: addUser_1.username,
      };
      const userDto: CreateUserDto = {
        email: addUser_1.email,
        password: addUser_1.password,
        firstName: addUser_1.firstName,
        lastName: addUser_1.lastName,
        username: addUser_1.username,
      };
      const spy = jest
        .spyOn(usersService, 'create')
        .mockImplementation(
          (): Promise<ReadUserDto> => Promise.resolve(expected_user),
        );

      expect(await usersController.create(userDto)).toBe(expected_user);
      expect(spy).toHaveBeenCalled();
    });

    it('should return an HTTP exception on invalid data', async () => {
      // not really invalid, but the service mock throws
      const userDto: CreateUserDto = {
        email: addUser_1.email,
        password: addUser_1.password,
        firstName: addUser_1.firstName,
        lastName: addUser_1.lastName,
        username: addUser_1.username,
      };
      const errorMessage = 'Service error message';
      const spy = jest.spyOn(usersService, 'create').mockImplementation(() => {
        throw new Error(errorMessage);
      });

      try {
        await usersController.create(userDto);
        // When service throws, the controll must also throw, so the next line must not be reached
        expect(true).toBe(false.valueOf);
      } catch (e) {
        expect(e.status).toBe(HttpStatus.BAD_REQUEST);
        expect(e.message).toBe(errorMessage);
        expect(e instanceof HttpException).toBeTruthy();
      }
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return the data returned by the UsersService', async () => {
      const expected_users: ReadUserDto[] = [].concat(initialUserRepository);
      const spy = jest
        .spyOn(usersService, 'findAll')
        .mockImplementation(
          (): Promise<ReadUserDto[]> => Promise.resolve(expected_users),
        );

      expect(await usersController.findAll()).toBe(expected_users);
      expect(spy).toHaveBeenCalled();
    });

    it('should return an HTTP exception if the service throws', async () => {
      const errorMessage = 'Service error message';
      const spy = jest
        .spyOn(usersService, 'findAll')
        .mockImplementation(() => {
          throw new Error(errorMessage);
        });

      try {
        await usersController.findAll();
        // When service throws, the controll must also throw, so the next line must not be reached
        expect(true).toBe(false.valueOf);
      } catch (e) {
        expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(e.message).toBe(errorMessage);
        expect(e instanceof HttpException).toBeTruthy();
      }
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('findByID', () => {
    it('should return the data returned by the UsersService', async () => {
      const expected_user: ReadUserDto = {
        id: user_1.id,
        email: user_1.email,
        firstName: user_1.firstName,
        lastName: user_1.lastName,
        username: user_1.username,
      };
      const spy = jest
        .spyOn(usersService, 'findByID')
        .mockImplementation(
          (): Promise<ReadUserDto> => Promise.resolve(expected_user),
        );

      expect(await usersController.findByID(user_1.id)).toBe(
        expected_user,
      );
      expect(spy).toHaveBeenCalled();
    });

    it('should return an HTTP exception if user is not found by ID', async () => {
      // not really invalid, but the service mock throws
      const ID: number = 4711;
      const errorMessage = 'Service error message';
      const spy = jest
        .spyOn(usersService, 'findByID')
        .mockImplementation(() => {
          throw new Error(errorMessage);
        });

      try {
        await usersController.findByID(ID);
        // When service throws, the controll must also throw, so the next line must not be reached
        expect(true).toBe(false.valueOf);
      } catch (e) {
        expect(e.status).toBe(HttpStatus.NOT_FOUND);
        expect(e.message).toBe(errorMessage);
        expect(e instanceof HttpException).toBeTruthy();
      }
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('should return the data returned by the UsersService', async () => {
      const expected_user: ReadUserDto = {
        id: user_1.id,
        email: user_1.email,
        firstName: user_1.firstName,
        lastName: user_1.lastName,
        username: user_1.username,
      };
      const spy = jest
        .spyOn(usersService, 'findByEmail')
        .mockImplementation(
          (): Promise<ReadUserDto> => Promise.resolve(expected_user),
        );

      expect(await usersController.findByEmail(user_1.id.toString())).toBe(
        expected_user,
      );
      expect(spy).toHaveBeenCalled();
    });

    it('should return an HTTP exception if user is not found by e-Mail', async () => {
      // not really invalid, but the service mock throws
      const eMail = 'a.b@x.com';
      const errorMessage = 'Service error message';
      const spy = jest
        .spyOn(usersService, 'findByEmail')
        .mockImplementation(() => {
          throw new Error(errorMessage);
        });

      try {
        await usersController.findByEmail(eMail);
        // When service throws, the controll must also throw, so the next line must not be reached
        expect(true).toBe(false.valueOf);
      } catch (e) {
        expect(e.status).toBe(HttpStatus.NOT_FOUND);
        expect(e.message).toBe(errorMessage);
        expect(e instanceof HttpException).toBeTruthy();
      }
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should call update method of UsersService', async () => {
      const expected_user: ReadUserDto = {
        id: user_1.id,
        email: user_1.email,
        firstName: 'Updated',
        lastName: 'Updated',
        username: user_1.username,
      };
      const userDto: UpdateUserDto = {
        firstName: 'Updated',
        lastName: 'Updated',
        password: 'Updated',
      };
      const spy = jest
        .spyOn(usersService, 'update')
        .mockImplementation(
          (): Promise<ReadUserDto> => Promise.resolve(expected_user),
        );

      expect(await usersController.update(user_1.id, userDto)).toBe(
        expected_user,
      );
      expect(spy).toHaveBeenCalled();
    });

    it('should return an HTTP exception if the user ID does not exist', async () => {
      const userDto: UpdateUserDto = {
        firstName: 'Updated',
        lastName: 'Updated',
        password: 'Updated',
      };
      const errorMessage = 'No user to update';
      const spy = jest.spyOn(usersService, 'update').mockImplementation(() => {
        throw new Error(errorMessage);
      });

      try {
        await usersController.update(4711, userDto);
        // Expecting the controller to throw, so the next line must not be reached
        expect(true).toBe(false.valueOf);
      } catch (e) {
        expect(e.status).toBe(HttpStatus.NO_CONTENT);
        expect(e.message).toBe(errorMessage);
        expect(e instanceof HttpException).toBeTruthy();
      }
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should call remove method of UsersService', () => {
      const spy = jest.spyOn(usersService, 'remove').mockImplementation(() => {
        return Promise.resolve(undefined);
      });

      usersController.remove(user_1.id);

      expect(spy).toHaveBeenCalled();
    });

    it('should return an HTTP exception if the user ID does not exist', async () => {
      const errorMessage = 'User does not exist';
      const spy = jest.spyOn(usersService, 'remove').mockImplementation(() => {
        throw new Error(errorMessage);
      });

      try {
        await usersController.remove(4711);
        // Expecting the controller to throw, so the next line must not be reached
        expect(true).toBe(false.valueOf);
      } catch (e) {
        expect(e.status).toBe(HttpStatus.NO_CONTENT);
        expect(e.message).toBe(errorMessage);
        expect(e instanceof HttpException).toBeTruthy();
      }
      expect(spy).toHaveBeenCalled();
    });
  });
});
