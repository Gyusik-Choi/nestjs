import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import * as session from 'express-session';
import * as passport from 'passport';
import * as createRedisStore from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // csurf 살펴보기

  await app.listen(3000);
}
bootstrap();
