import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { user_1 } from '../users/users.testdata';
import { User } from '../users/entities/user.entity';
import { UserRepositoryMock } from '../users/users.repository.mock';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { ReadUserDto } from '../users/dto/read-user.dto';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfiguration } from './authConfiguration';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: jwtConfiguration.secret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: UserRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user for a matching password', async () => {
      const expected_user: ReadUserDto = {
        id: user_1.id,
        email: user_1.email,
        firstName: user_1.firstName,
        lastName: user_1.lastName,
        username: user_1.username,
      };
      const spy = jest
        .spyOn(usersService, 'validateUser')
        .mockImplementation(
          (): Promise<ReadUserDto> => Promise.resolve(expected_user),
        );

      expect(
        await usersService.validateUser(user_1.username, 'changeme'),
      ).toEqual(expected_user);
      expect(spy).toHaveBeenCalled();
    });

    it('should return undefined for a not matching password', async () => {
      const spy = jest
        .spyOn(usersService, 'validateUser')
        .mockImplementation(() => {
          return undefined;
        });
      expect(
        await usersService.validateUser(user_1.username, 'wrongpassword'),
      ).toEqual(undefined);
      expect(spy).toHaveBeenCalled();
    });
  });
});
