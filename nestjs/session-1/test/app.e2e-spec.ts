import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserAccount } from '../src/entities/userAccount.entity';
import { ExpressSessions } from '../src/entities/expressSessions.entity';

const mockUsersRepository = () => ({
  save: jest.fn(),
  findOne: jest.fn(),
});

const mockSessionsRepository = () => ({});

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(UserAccount))
      .useValue(mockUsersRepository)
      .overrideProvider(getRepositoryToken(ExpressSessions))
      .useValue(mockSessionsRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
