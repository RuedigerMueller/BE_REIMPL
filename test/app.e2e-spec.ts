import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // https://circleci.com/blog/relational-db-testing/

  it('/users (Post)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        "username": "john",
        "password": "changeme",
        "firstName": "John",
        "lastName": "Miller",
        "email": "john@example.com"
      })
      .expect(201)
  });
});
