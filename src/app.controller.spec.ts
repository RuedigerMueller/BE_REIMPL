import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';
import { jwtConfiguration } from './auth/authConfiguration';
import { User } from './users/entities/user.entity';
import { UserRepositoryMock } from './users/users.repository.mock';
import { UsersService } from './users/users.service';

describe('AppController', () => {
  let appController: AppController;

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
          useClass: UserRepositoryMock,
        },],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });
  });
});
