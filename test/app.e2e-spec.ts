import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserDto } from '../src/users/dto/update-user.dto';
import { User } from '../src/users/entities/user.entity';
import * as request from 'supertest';
import { Connection, Repository } from 'typeorm';
import { AppModule } from './../src/app.module';
import {
  addUser_1,
  initialUserRepository,
  user_1,
} from './../src/users/users.testdata';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfiguration } from '../src/auth/configuration/authConfiguration';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepositoryMock } from '../src/users/users.repository.mock';
import { ReadUserDto } from '../src/users/dto/read-user.dto';

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
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    repository = moduleFixture.get('UserRepository');
    authService = moduleFixture.get<AuthService>(AuthService);
    connection = repository.manager.connection;
    // dropBeforeSync: If set to true then it drops the database with all its tables and data
    await connection.synchronize(true);

    const insertQueries = [];
    let insertSQL = '';
    initialUserRepository.forEach((user) => {
      insertSQL = `INSERT INTO User (id, username, password, firstname, lastname, email) VALUES (NULL, '${user.username}', '${user.password}', '${user.firstName}', '${user.lastName}', '${user.email}');`;
      insertQueries.push(connection.query(insertSQL));
    });
    await Promise.all(insertQueries);

    await app.init();
  });

  afterEach(async () => {
    const deleteTableSQL = 'DELETE FROM User WHERE ID > 3';
    await connection.query(deleteTableSQL);
  });

  afterAll(async () => {
    const dropTableSQL = 'DROP TABLE IF EXISTS `User`';
    await connection.query(dropTableSQL);
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

  it('/users (Get)', async () => {
    const accessToken = await login(authService, app);

    const resp = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(resp.statusCode).toBe(HttpStatus.OK);

    const expected_result = [
      {
        id: 1,
        email: initialUserRepository[0].email,
        firstName: initialUserRepository[0].firstName,
        lastName: initialUserRepository[0].lastName,
        username: initialUserRepository[0].username,
      },
      {
        id: 2,
        email: initialUserRepository[1].email,
        firstName: initialUserRepository[1].firstName,
        lastName: initialUserRepository[1].lastName,
        username: initialUserRepository[1].username,
      },
      {
        id: 3,
        email: initialUserRepository[2].email,
        firstName: initialUserRepository[2].firstName,
        lastName: initialUserRepository[2].lastName,
        username: initialUserRepository[2].username,
      },
    ];
    expect(resp.body).toEqual(expected_result);
  });

  it('/users (Get) should only accept calls with access token', async () => {
    const resp = await request(app.getHttpServer())
      .get('/users');

    expect(resp.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('/users/1 (Get)', async () => {
    const accessToken = await login(authService, app);

    const resp = await request(app.getHttpServer()).get('/users/1')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(resp.statusCode).toBe(HttpStatus.OK);
    expect(resp.body.username).toBe(initialUserRepository[0].username);
    expect(resp.body.firstName).toBe(initialUserRepository[0].firstName);
    expect(resp.body.lastName).toBe(initialUserRepository[0].lastName);
    expect(resp.body.email).toBe(initialUserRepository[0].email);
    expect(resp.body.password).toBeUndefined();
  });

  it('/users/1 (Get) should only accept calls with access token', async () => {
    const resp = await request(app.getHttpServer()).get('/users/1');

    expect(resp.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('/users/byEMail (Get)', async () => {
    const accessToken = await login(authService, app);

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

  it('/users/byEMail (Get) should only accept calls with access token', async () => {
    const resp = await request(app.getHttpServer())
      .get(`/users/byEMail/?email=${initialUserRepository[0].email}`)

    expect(resp.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('/users/1 (Patch)', async () => {
    const accessToken = await login(authService, app);

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

  it('/users/1 (Patch) should only accept calls with access token', async () => {
    const updateUserDto: UpdateUserDto = {
      firstName: 'updated',
      lastName: 'updated',
      password: 'update',
    };

    const resp = await request(app.getHttpServer())
      .patch(`/users/1`)
      .send(updateUserDto)

    expect(resp.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('/users/1 (Delete)', async () => {
    const accessToken = await login(authService, app);

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

    expect(resp.statusCode).toBe(HttpStatus.OK);
    expect(resp.body).toStrictEqual({});
  });

  it('/users/1 (Patch) should only accept calls with access token', async () => {
    const resp = await request(app.getHttpServer())
      .delete(`/users/1`);
    
      expect(resp.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });
});

async function login(authService: AuthService, app: INestApplication): Promise<String> {
  const expected_user: ReadUserDto = {
    id: user_1.id,
    email: user_1.email,
    firstName: user_1.firstName,
    lastName: user_1.lastName,
    username: user_1.username,
  };
  const spy = jest
    .spyOn(authService, 'validateUser')
    .mockImplementation(
      (): Promise<ReadUserDto> => Promise.resolve(expected_user)
    );

  const loginResp = await request(app.getHttpServer())
    .post('/login')
    .set('Content-Type', 'application/json')
    .send({
      username: user_1.username,
      password: 'changeme'
    });
  console.log(loginResp.body.access_token);
  expect(spy).toHaveBeenCalled();
  return loginResp.body.access_token;
}

