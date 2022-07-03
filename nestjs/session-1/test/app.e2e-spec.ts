import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
// import { Repository } from 'typeorm';
// import { Sessions } from './../src/entities/session.entity';
// import { getRepositoryToken } from '@nestjs/typeorm';

// const mockSessionsRepository = () => ({});

// type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AppController (e2e)', () => {
  let app: INestApplication;
  // let sessionsRepository: MockRepository<Sessions>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      // providers: [
      //   {
      //     provide: getRepositoryToken(Sessions),
      //     useValue: mockSessionsRepository(),
      //   },
      // ],
    }).compile();

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
