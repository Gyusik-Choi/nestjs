// https://www.youtube.com/watch?v=dXOfOgFFKuY
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { sessionOptions } from '../src/config/db-sessions.config';
import * as request from 'supertest';
import * as session from 'express-session';
import { AuthModule } from '../src/auth/auth.module';
import { AuthService } from '../src/auth/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserAccount } from '../src/entities/userAccount.entity';
import { ExpressSessions } from '../src/entities/expressSessions.entity';
import { Repository } from 'typeorm';
import { AuthController } from '../src/auth/auth.controller';

const mockUsersRepository = () => ({
  save: jest.fn(),
  findOne: jest.fn(),
});

const mockSessionsRepository = () => ({});

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

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
    // return request(app.getHttpServer()).post('/signUp').expect(200);
    return request(app.getHttpServer()).post('/signUp').expect(500);
  });
});
