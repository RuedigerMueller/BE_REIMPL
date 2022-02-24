import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Connection, Repository } from 'typeorm';
import { AuthService } from '../src/auth/auth.service';
import { jwtConfiguration } from '../src/config/authConfiguration';
import { Role } from '../src/roles/entities/role.entity';
import { RoleEnum } from '../src/roles/roles.enum';
import { RoleRepositoryMock } from '../src/roles/roles.repository.mock';
import { ReadUserDto } from '../src/users/dto/read-user.dto';
import { UpdateUserDto } from '../src/users/dto/update-user.dto';
import { User } from '../src/users/entities/user.entity';
import { UserRepositoryMock } from '../src/users/users.repository.mock';
import { UsersService } from '../src/users/users.service';
import { AppModule } from './../src/app.module';
import {
  addUser_1,
  admin,
  initialUserRepository,
  user_1
} from './../src/users/users.testdata';
import { user2readUserDto } from './helpers';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<User>;
  let authService: AuthService;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        JwtModule.register({
          secret: jwtConfiguration.secret,
          signOptions: { expiresIn: '1800s' },
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

    app = moduleFixture.createNestApplication();
    repository = moduleFixture.get('UserRepository');
    authService = moduleFixture.get<AuthService>(AuthService);
    connection = repository.manager.connection;
    // dropBeforeSync: If set to true then it drops the database with all its tables and data
    await connection.synchronize(true);

    const insertUserQueries = [];
    let insertUserSQL = '';
    initialUserRepository.forEach((user) => {
      insertUserSQL = `INSERT INTO User (id, username, password, firstname, lastname, email) VALUES (NULL, '${user.username}', '${user.password}', '${user.firstName}', '${user.lastName}', '${user.email}');`;
      insertUserQueries.push(connection.query(insertUserSQL));
    });
    await Promise.all(insertUserQueries);

    const insertRoleQueries = [];
    let insertRoleSQL = '';
    insertRoleSQL = `INSERT INTO Role (id, role, userid) VALUES (NULL, '${RoleEnum.Admin}', '${initialUserRepository[0].id}');`;
    insertRoleQueries.push(connection.query(insertRoleSQL));
    initialUserRepository.forEach((user) => {
      insertRoleSQL = `INSERT INTO Role (id, role, userid) VALUES (NULL, '${RoleEnum.User}', '${user.id}');`;
      insertRoleQueries.push(connection.query(insertRoleSQL));
    });
    await Promise.all(insertRoleQueries);

    await app.init();
  });

  afterEach(async () => {
    const deleteRolesSQL = 'DELETE FROM Role WHERE userid >4';
    await connection.query(deleteRolesSQL);
    const deleteUsersSQL = 'DELETE FROM User WHERE ID > 4';
    await connection.query(deleteUsersSQL);
  });

  afterAll(async () => {
    const dropRoleTableSQL = 'DROP TABLE IF EXISTS `Role`';
    await connection.query(dropRoleTableSQL);
    const dropUserTableSQL = 'DROP TABLE IF EXISTS `User`';
    await connection.query(dropUserTableSQL);
    await connection.close();
  });

  it('/users (Post)', async () => {
    const resp = await request(app.getHttpServer()).post('/users').send({
      username: addUser_1.username,
      password: addUser_1.password,
      firstName: addUser_1.firstName,
      lastName: addUser_1.lastName,
      email: addUser_1.email,
    });
    expect(resp.statusCode).toBe(HttpStatus.CREATED);
    expect(resp.body.id).toBeDefined();
    expect(resp.body.username).toBe(addUser_1.username);
    expect(resp.body.firstName).toBe(addUser_1.firstName);
    expect(resp.body.lastName).toBe(addUser_1.lastName);
    expect(resp.body.email).toBe(addUser_1.email);
    expect(resp.body.password).toBeUndefined;
  });
  describe('/users (Get)', () => {
    it('should get all the users', async () => {
      const accessToken = await login(authService, app, user2readUserDto(admin));

      const resp = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(resp.statusCode).toBe(HttpStatus.OK);

      const expected_result = [
        user2readUserDto(initialUserRepository[0]),
        user2readUserDto(initialUserRepository[1]),
        user2readUserDto(initialUserRepository[2]),
        user2readUserDto(initialUserRepository[3]),
      ];
      expect(resp.body).toEqual(expected_result);
    });

    it('should only accept calls from users without admin role', async () => {
      const accessToken = await login(authService, app, user2readUserDto(user_1));
      const resp = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(resp.statusCode).toBe(HttpStatus.FORBIDDEN);
    });

    it('should only accept calls with access token', async () => {
      const resp = await request(app.getHttpServer()).get('/users');

      expect(resp.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/users/1 (Get)', () => {
    it('should get user with ID 1', async () => {
      const accessToken = await login(authService, app, user2readUserDto(admin));

      const resp = await request(app.getHttpServer())
        .get('/users/1')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(resp.statusCode).toBe(HttpStatus.OK);
      expect(resp.body.username).toBe(initialUserRepository[0].username);
      expect(resp.body.firstName).toBe(initialUserRepository[0].firstName);
      expect(resp.body.lastName).toBe(initialUserRepository[0].lastName);
      expect(resp.body.email).toBe(initialUserRepository[0].email);
      expect(resp.body.password).toBeUndefined();
    });


    it('should only accept calls from users without admin role', async () => {
      const accessToken = await login(authService, app, user2readUserDto(user_1));

      const resp = await request(app.getHttpServer())
        .get('/users/1')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(resp.statusCode).toBe(HttpStatus.FORBIDDEN);
    });

    it('should only accept calls with access token', async () => {
      const resp = await request(app.getHttpServer()).get('/users/1');

      expect(resp.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/users/byEMail (Get)', () => {
    it('should get user with e-mail address', async () => {
      const accessToken = await login(authService, app, user2readUserDto(admin));

      const resp = await request(app.getHttpServer())
        .get(`/users/byEMail/?email=${initialUserRepository[0].email}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(resp.statusCode).toBe(HttpStatus.OK);
      expect(resp.body.username).toBe(initialUserRepository[0].username);
      expect(resp.body.firstName).toBe(initialUserRepository[0].firstName);
      expect(resp.body.lastName).toBe(initialUserRepository[0].lastName);
      expect(resp.body.email).toBe(initialUserRepository[0].email);
      expect(resp.body.password).toBeUndefined();
    });

    it('should only accept calls from users without admin role', async () => {
      const accessToken = await login(authService, app, user2readUserDto(user_1));

      const resp = await request(app.getHttpServer())
        .get(`/users/byEMail/?email=${initialUserRepository[0].email}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(resp.statusCode).toBe(HttpStatus.FORBIDDEN);
    });

    it('should only accept calls with access token', async () => {
      const resp = await request(app.getHttpServer()).get(
        `/users/byEMail/?email=${initialUserRepository[0].email}`,
      );

      expect(resp.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/users/1 (Patch)', () => {
    it('should update user with ID 1', async () => {
      const accessToken = await login(authService, app, user2readUserDto(admin));

      const updateUserResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          username: addUser_1.username,
          password: addUser_1.password,
          firstName: addUser_1.firstName,
          lastName: addUser_1.lastName,
          email: addUser_1.email,
        })
        .set('Authorization', `Bearer ${accessToken}`);

      const updateUserDto: UpdateUserDto = {
        firstName: 'updated',
        lastName: 'updated',
        password: 'update',
      };

      const resp = await request(app.getHttpServer())
        .patch(`/users/${updateUserResponse.body.id}`)
        .send(updateUserDto)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(resp.statusCode).toBe(HttpStatus.OK);
      expect(resp.body.username).toBe(addUser_1.username);
      expect(resp.body.firstName).toBe('updated');
      expect(resp.body.lastName).toBe('updated');
      expect(resp.body.email).toBe(addUser_1.email);
      expect(resp.body.password).toBeUndefined();
    });

    it('should only accept calls from users without admin role', async () => {
      const accessToken = await login(authService, app, user2readUserDto(user_1));

      const updateUserDto: UpdateUserDto = {
        firstName: 'updated',
        lastName: 'updated',
        password: 'update',
      };

      const resp = await request(app.getHttpServer())
        .patch(`/users/1`)
        .send(updateUserDto)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(resp.statusCode).toBe(HttpStatus.FORBIDDEN);
    });

    it('should only accept calls with access token', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'updated',
        lastName: 'updated',
        password: 'update',
      };

      const resp = await request(app.getHttpServer())
        .patch(`/users/1`)
        .send(updateUserDto);

      expect(resp.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/users/1 (Delete)', () => {
    it('should delete user with ID 1', async () => {
      const accessToken = await login(authService, app, user2readUserDto(admin));

      const createUserResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          username: addUser_1.username,
          password: addUser_1.password,
          firstName: addUser_1.firstName,
          lastName: addUser_1.lastName,
          email: addUser_1.email,
        })
        .set('Authorization', `Bearer ${accessToken}`);

      const resp = await request(app.getHttpServer())
        .delete(`/users/${createUserResponse.body.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(resp.statusCode).toBe(HttpStatus.NO_CONTENT);
      expect(resp.body).toStrictEqual({});
    });

    it('should only accept calls from users without admin role', async () => {
      const accessToken = await login(authService, app, user2readUserDto(user_1));

      const resp = await request(app.getHttpServer())
        .delete(`/users/1`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(resp.statusCode).toBe(HttpStatus.FORBIDDEN);
    });

    it('should only accept calls with access token', async () => {
      const resp = await request(app.getHttpServer())
        .delete(`/users/1`);

      expect(resp.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
});

async function login(
  authService: AuthService,
  app: INestApplication,
  user: ReadUserDto,
): Promise<string> {
  const spy = jest
    .spyOn(authService, 'validateUser')
    .mockImplementation((): Promise<ReadUserDto> => Promise.resolve(user));

  const loginResp = await request(app.getHttpServer())
    .post('/login')
    .set('Content-Type', 'application/json')
    .send({
      username: user.username,
      password: 'changeme',
    });
  expect(spy).toHaveBeenCalled();
  return loginResp.body.access_token;
}
