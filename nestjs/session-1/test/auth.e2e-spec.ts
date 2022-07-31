// https://www.youtube.com/watch?v=dXOfOgFFKuY
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserAccount } from '../src/entities/userAccount.entity';
import { ExpressSessions } from '../src/entities/expressSessions.entity';
import * as session from 'express-session';
import { sessionOptions } from '../src/config/db-sessions.config';

const mockUsersRepository = () => ({
  save: jest.fn().mockResolvedValue({
    id: 1,
    email: 'bill@ms.com',
    password: 'Abcde12345',
    emailVarification: false,
  }),
  findOne: jest.fn().mockResolvedValue(false),
});

const mockSessionsRepository = () => ({});

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      // https://www.youtube.com/watch?v=dXOfOgFFKuY
      // https://stackoverflow.com/questions/58344126/how-can-i-mock-nest-typeorm-database-module-in-end-to-end-e2e-tests
      .overrideProvider(getRepositoryToken(UserAccount))
      .useValue(mockUsersRepository)
      .overrideProvider(getRepositoryToken(ExpressSessions))
      .useValue(mockSessionsRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(session(sessionOptions));
    await app.init();
  });

  it('/signUp (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/signUp')
      .set('Accept', 'application/json')
      .send({ email: 'bill@ms.com', password: 'Abcde12345!' })
      .expect(200);
    // return request(app.getHttpServer()).post('/signUp').expect(404);
  });
});
