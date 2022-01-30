import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { addUser_1, initialUserRepository, user_1 } from './users.testdata';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('create', () => {
    it('should return the data returned by the UsersService', () => {
      const expected_result: User = addUser_1;
      const userDto: CreateUserDto = addUser_1;
      const spy = jest.spyOn(usersService, 'create').mockImplementation(() => expected_result);

      expect(usersController.create(userDto)).toBe(expected_result);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return the data returned by the UsersService', () => {
      const expected_result: ReadonlyArray<User> = initialUserRepository;
      const spy = jest.spyOn(usersService, 'findAll').mockImplementation(() => expected_result);

      expect(usersController.findAll()).toBe(expected_result);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return the data returned by the UsersService', () => {
      const expected_result: User = user_1;
      const spy = jest.spyOn(usersService, 'findOne').mockImplementation(() => expected_result);

      expect(usersController.findOne(user_1.id.toString())).toBe(expected_result);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should call update method of UsersService', () => {
      const expected_result: User = user_1;
      expected_result.firstName = 'Updated';
      expected_result.lastName = 'Updated';
      expected_result.password = 'Updated';
      const userDto: UpdateUserDto = expected_result;
      const spy = jest.spyOn(usersService, 'update').mockImplementation(() => expected_result);

      expect(usersController.update(user_1.id.toString(), userDto)).toBe(expected_result);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should call remove method of UsersService', () => {
      const spy = jest.spyOn(usersService, 'remove').mockImplementation(() => { return });

      usersController.remove(user_1.id.toString());

      expect(spy).toHaveBeenCalled();
    });
  });
});
