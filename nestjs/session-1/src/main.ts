import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { sessionOptions } from './config/db-sessions.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(session(sessionOptions));

  await app.listen(3000);
}
bootstrap();
