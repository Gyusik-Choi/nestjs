import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from '../src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // https://stackoverflow.com/questions/60217131/typeorm-and-nestjs-creating-database-tables-at-the-beginning-of-an-e2e-test
      imports: [
        AuthModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: 'nestjs_typeorm1_e2e_test',
          entities: ['./**/*.entity.ts'],
          synchronize: false,
        }),
      ],
    }).compile();

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
});
