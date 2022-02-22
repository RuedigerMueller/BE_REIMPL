import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { user_1 } from '../users/users.testdata';
import { User } from '../users/entities/user.entity';
import { UserRepositoryMock } from '../users/users.repository.mock';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { ReadUserDto } from '../users/dto/read-user.dto';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfiguration } from '../config/authConfiguration';
import { user2readUserDto } from '../../test/helpers';
import { Role } from '../roles/entities/role.entity';
import { RoleRepositoryMock } from '../roles/roles.repository.mock';

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
          useClass: UserRepositoryMock,
        },
        {
          provide: getRepositoryToken(Role),
          useClass: RoleRepositoryMock,
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
