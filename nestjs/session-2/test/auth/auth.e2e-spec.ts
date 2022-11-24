import * as request from 'supertest';
import * as session from 'express-session';
import * as passport from 'passport';
import * as createRedisStore from 'connect-redis';
import { INestApplication } from '@nestjs/common';
import { UserAccount } from '../../src/entities/userAccount.entity';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../../src/auth/auth.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ExpressSession } from '../../src/entities/expressSession.entity';
import { createClient } from 'redis';

describe('Auth', () => {
  let app: INestApplication;
  let userRepository: Repository<UserAccount>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        AuthModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT),
          username: process.env.DATABASE_USERNAME,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_TEST_DATABASE,
          entities: [UserAccount, ExpressSession],
        }),
        TypeOrmModule.forFeature([UserAccount, ExpressSession]),
      ],
    }).compile();

    const RedisStore = createRedisStore(session);
    const redisHost: string = process.env.REDIS_HOST;
    const redisPort: number = parseInt(process.env.REDIS_PORT);
    const redisClient = createClient({
      url: `redis://${redisHost}:${redisPort}`,
    });

    redisClient.on('error', (err) => console.log(err));
    redisClient.on('connect', () =>
      console.log('Connected to redis successfully'),
    );

    app = moduleRef.createNestApplication();
    app.use(
      session({
        store: new RedisStore({ client: redisClient as any }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());

    userRepository = moduleRef.get<Repository<UserAccount>>(
      getRepositoryToken(UserAccount),
    );

    await app.init();
  });

  it('/signUp (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/signUp')
      .set('Accept', 'application/json')
      .send({ email: 'bill@ms.com', password: 'Abcde12345!' })
      .expect(201);
  });

  afterAll(async () => {
    await userRepository.query('DELETE FROM UserAccount');
  });
});
