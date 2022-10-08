import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbConfigModule } from './db-config/db-config.module';
import { DbConfigService } from './db-config/db-config.service';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from './auth/passport/passport.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [DbConfigModule],
      useClass: DbConfigService,
      inject: [DbConfigService],
    }),
    AuthModule,
    PassportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
