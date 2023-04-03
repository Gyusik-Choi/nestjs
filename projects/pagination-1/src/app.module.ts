import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './board/board.module';
import { DbConfigModule } from './db-config/db-config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConfigService } from './db-config/db-config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    BoardModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DbConfigModule, 
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
