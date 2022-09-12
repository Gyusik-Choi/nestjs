import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from '../src/auth/auth.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from '../src/entities/userAccount.entity';
import { Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import * as session from 'express-session';
import { sessionOptions } from '../src/config/db-sessions.config';
import { ExpressSessions } from '../src/entities/expressSessions.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  // https://stackoverflow.com/questions/60217131/typeorm-and-nestjs-creating-database-tables-at-the-beginning-of-an-e2e-test
  let repository: Repository<UserAccount>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // https://stackoverflow.com/questions/60217131/typeorm-and-nestjs-creating-database-tables-at-the-beginning-of-an-e2e-test
      imports: [
        // process.env 값을 참조하는데 ConfigModule.forRoot() 를 누락해왔다
        ConfigModule.forRoot(),
        AuthModule,
        TypeOrmModule.forRoot({
          // type 을 누락해왔다
          type: 'mysql',
          host: '127.0.0.1',
          port: parseInt(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: 'nestjs_typeorm1_e2e_test',
          entities: [UserAccount, ExpressSessions],
          logging: true,
          synchronize: false,
        }),
        // https://stackoverflow.com/questions/55717089/test-nestjs-service-against-actual-database
        TypeOrmModule.forFeature([UserAccount, ExpressSessions]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(session(sessionOptions));
    // RepositoryNotFoundError: No repository for "UserAccount" was found. Looks like this entity is not registered in current "default" connection?
    repository = moduleFixture.get<Repository<UserAccount>>(
      getRepositoryToken(UserAccount),
    );
    await app.init();
  });

  // it('/signUp (POST)', () => {
  //   return request(app.getHttpServer())
  //     .post('/auth/signUp')
  //     .set('Accept', 'application/json')
  //     .send({ email: 'bill@ms.com', password: 'Abcde12345!' })
  //     .expect(201);
  // });

  it('/sayHi (GET)', () => {
    return request(app.getHttpServer()).get('/auth/sayHi').expect(200);
  });
});
