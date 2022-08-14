// https://www.youtube.com/watch?v=dXOfOgFFKuY
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserAccount } from '../src/entities/userAccount.entity';
import { ExpressSessions } from '../src/entities/expressSessions.entity';
import * as bcrypt from 'bcrypt';
import * as httpMocks from 'node-mocks-http';
import { SignInInfo } from '../src/auth/dto/signInInfo.dto';
// import { AuthService } from '../src/auth/auth.service';

const mockUsersRepository = () => ({
  findOne: jest.fn().mockResolvedValue(false),
  save: jest.fn().mockResolvedValue({
    id: 1,
    email: 'bill@ms.com',
    password: 'Abcde12345',
    emailVarification: false,
  }),
});

// const mockUsersRepository = {
//   save: jest.fn().mockResolvedValue({
//     id: 1,
//     email: 'bill@ms.com',
//     password: 'Abcde12345',
//     emailVarification: false,
//   }),
//   findOne: jest.fn().mockResolvedValue([null, false]),
// };

const mockSessionsRepository = () => ({});

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      // providers: [
      //   AuthService,
      //   {
      //     provide: getRepositoryToken(UserAccount),
      //     useValue: mockUsersRepository(),
      //   },
      //   {
      //     provide: getRepositoryToken(ExpressSessions),
      //     useValue: mockSessionsRepository(),
      //   },
      // ],
    })
      // https://www.youtube.com/watch?v=dXOfOgFFKuY
      // https://stackoverflow.com/questions/58344126/how-can-i-mock-nest-typeorm-database-module-in-end-to-end-e2e-tests
      .overrideProvider(getRepositoryToken(UserAccount))
      .useValue(mockUsersRepository())
      .overrideProvider(getRepositoryToken(ExpressSessions))
      .useValue(mockSessionsRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/signUp (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/signUp')
      .set('Accept', 'application/json')
      .send({ email: 'bill@ms.com', password: 'Abcde12345!' })
      .expect(201);
  });

  // it('/signIn (POST)', async () => {
  //   const req = httpMocks.createRequest({
  //     session: {
  //       isAuthenticated: false,
  //       userID: 'bill@ms.com',
  //     },
  //   });

  //   const userInputData = {
  //     email: 'bill@ms.com',
  //     password: 'Abcde12345!',
  //   };

  //   return request(app.getHttpServer())
  //     .post('/auth/signIn')
  //     .set('Accept', 'application/json')
  //     .expect(200);
  // });
});
