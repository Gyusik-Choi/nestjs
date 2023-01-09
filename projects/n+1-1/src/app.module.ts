import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AcademyModule } from './academy/academy.module';
import { SubjectModule } from './subject/subject.module';
import { DbConfigModule } from './db-config/db-config.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConfigService } from './db-config/db-config.service';

@Module({
  imports: [
    AcademyModule,
    SubjectModule,
    DbConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [DbConfigModule],
      useClass: DbConfigService,
      inject: [DbConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
