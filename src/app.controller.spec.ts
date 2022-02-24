import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';
import { jwtConfiguration } from './config/authConfiguration';
import { Role } from './roles/entities/role.entity';
import { roleRepositoryMockFactory } from './roles/roles.repository.mock.factory';
import { User } from './users/entities/user.entity';
import { userRepositoryMockFactory } from './users/user.respository.mock.factory';
import { UsersService } from './users/users.service';

describe('AppController', () => {
  let appController: AppController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: jwtConfiguration.secret,
          signOptions: { expiresIn: '1800s' },
        }),
      ],
      controllers: [AppController],
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

    appController = app.get<AppController>(AppController);
    authService = app.get<AuthService>(AuthService);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });
  });
});
