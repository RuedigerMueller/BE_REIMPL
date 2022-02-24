import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { jwtConfiguration } from '../config/authConfiguration';
import { Role } from '../roles/entities/role.entity';
import { roleRepositoryMockFactory } from '../roles/roles.repository.mock.factory';
import { ReadUserDto } from '../users/dto/read-user.dto';
import { user2readUserDto } from '../users/dto/user.dto.helpers';
import { User } from '../users/entities/user.entity';
import { userRepositoryMockFactory } from '../users/user.respository.mock.factory';
import { UsersService } from '../users/users.service';
import { user_1 } from '../users/users.testdata';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

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
          useFactory: userRepositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Role),
          useFactory: roleRepositoryMockFactory,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user for a matching password', async () => {
      const expected_user: ReadUserDto = user2readUserDto(user_1);
      const spy = jest
        .spyOn(usersService, 'validateUser')
        .mockImplementation(
          (): Promise<ReadUserDto> => Promise.resolve(expected_user),
        );

      expect(
        await authService.validateUser(user_1.username, 'changeme'),
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
        await authService.validateUser(user_1.username, 'wrongpassword'),
      ).toEqual(undefined);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return and access token', async () => {
      const user: ReadUserDto = user2readUserDto(user_1);

      const accessToken = await authService.login(user);
      const decodedToken = jwtService.decode(accessToken.access_token);

      expect(decodedToken['sub']).toBe(user_1.id);
      expect(decodedToken['username']).toBe(user_1.username);
      expect(decodedToken['firstName']).toBe(user_1.firstName);
      expect(decodedToken['lastName']).toBe(user_1.lastName);
      expect(decodedToken['email']).toBe(user_1.email);
    });
  });
});
