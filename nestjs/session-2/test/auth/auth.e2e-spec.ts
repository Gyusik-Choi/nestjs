import * as request from 'supertest';
import * as session from 'express-session';
import * as passport from 'passport';
import * as createRedisStore from 'connect-redis';
import { INestApplication } from '@nestjs/common';
import { UserAccount } from '../../src/entities/userAccount.entity';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../../src/auth/auth.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ExpressSession } from '../../src/entities/expressSession.entity';
import { createClient } from 'redis';

// npm run test:e2e test/auth/auth.e2e-spec.ts
describe('Auth', () => {
  let app: INestApplication;
  let userRepository: Repository<UserAccount>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        // ConfigModule 로는 안 된다
        // .forRoot() 를 추가해줘야 한다
        ConfigModule.forRoot(),
        AuthModule,
        // https://stackoverflow.com/questions/66193796/using-test-database-when-e2e-testing-nestjs
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
            return {
              type: 'mysql',
              host: configService.get<string>('DATABASE_HOST'),
              port: parseInt(configService.get<string>('DATABASE_PORT')),
              username: configService.get<string>('DATABASE_USERNAME'),
              password: configService.get<string>('DATABASE_PASSWORD'),
              database: configService.get<string>('DATABASE_TEST_DATABASE'),
              entities: [UserAccount, ExpressSession],
            };
          },
          // https://stackoverflow.com/questions/67432760/nestjs-e2e-testing-smuggle-inject-custom-environment-variables-before-conf
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([UserAccount, ExpressSession]),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    userRepository = moduleRef.get<Repository<UserAccount>>(
      getRepositoryToken(UserAccount),
    );

    const configService = app.get<ConfigService>(ConfigService);

    const RedisStore = createRedisStore(session);
    const redisHost: string = configService.get('REDIS_HOST');
    const redisPort: number = configService.get('REDIS_PORT');
    const redisClient = createClient({
      // 참조한 소스 코드에서는 host, port 정보를 입력했는데
      // 에러가 발생하길래 알고보니 url 을 입력하는 것으로 바뀌었다
      // https://stackoverflow.com/questions/72130315/how-to-use-redis-client-in-nestjs
      url: `redis://${redisHost}:${redisPort}`,
    });

    redisClient.on('error', (err) => console.log(err));
    redisClient.on('connect', () =>
      console.log('Connected to redis successfully'),
    );

    app.use(
      session({
        store: new RedisStore({ client: redisClient as any }),
        secret: configService.get('SESSION_SECRET'),
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 1,
        },
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());

    await app.init();
  });

  it('/signUp (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/signUp')
      .set('Accept', 'application/json')
      .send({ email: 'bill@ms.com', password: 'Abcde12345!' })
      .expect(201);
  });

  it('/signIn (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/signIn')
      .set('Accept', 'application/json')
      .send({ email: 'bill@ms.com', password: 'Abcde12345!' })
      .expect(201);
  });

  it('/authenticate (GET)', async () => {
    return request(app.getHttpServer())
      .get('/auth/authenticate')
      .set('Accept', 'application/json')
      .send({ email: 'bill@ms.com', password: 'Abcde12345!' })
      .expect(201);
  });

  afterAll(async () => {
    await userRepository.query('DELETE FROM UserAccount');
    await userRepository.query('DELETE FROM ExpressSessions');
  });
});
