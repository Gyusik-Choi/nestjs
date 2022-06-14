import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as sessionMySQLStore from 'express-mysql-session';
import { AppModule } from './app.module';
// import { sessionOptions } from './config/db-sessions.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = {
    host: process.env.DB_HOST,
    port: 3306,
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    clearExpired: true,
    checkExpirationInterval: 30000,
    expiration: 30000,
  };

  const MySQLStore = sessionMySQLStore(session);
  const sessionStore = new MySQLStore(options);

  const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30000,
    },
  };

  // const options = {
  //   host: 'localhost',
  //   port: 3306,
  //   user: 'root',
  //   password: 'cks1991',
  //   database: 'nestjs_typeorm1',
  //   checkExpirationInterval: 30000,
  //   expiration: 60000,
  // };

  // const MySQLStore = sessionMySQLStore(session);
  // const sessionStore = new MySQLStore(options);

  // const sessionOptions = {
  //   secret: 'PALEBLUEDOT',
  //   store: sessionStore,
  //   resave: false,
  //   saveUninitialized: false,
  //   cookie: {
  //     maxAge: 60000,
  //   },
  // };

  app.use(session(sessionOptions));
  // app.enableCors();

  await app.listen(3000);
}
bootstrap();
