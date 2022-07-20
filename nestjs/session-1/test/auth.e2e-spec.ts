// https://www.youtube.com/watch?v=dXOfOgFFKuY
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { sessionOptions } from '../src/config/db-sessions.config';
import * as request from 'supertest';
import * as session from 'express-session';
import { AuthModule } from '../src/auth/auth.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(session(sessionOptions));
    await app.init();
  });

  it('/signUp (POST)', () => {
    return request(app.getHttpServer()).post('/signUp').expect(200);
  });
});
