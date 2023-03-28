import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbConfigModule } from './db-config/db-config.module';
import { TeamModule } from './team/team.module';
import { PlayerModule } from './player/player.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConfigService } from './db-config/db-config.service';
import { CoachModule } from './coach/coach.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), 
    DbConfigModule, 
    TeamModule, 
    PlayerModule,
    TypeOrmModule.forRootAsync({
      imports: [DbConfigModule],
      useClass: DbConfigService,
      inject: [DbConfigService],
    }),
    CoachModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
