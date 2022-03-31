import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SlackModule } from 'nestjs-slack-webhook';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotifyModule } from './notify/notify.module';
import slackConfig from './config/slack.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [slackConfig],
    }),
    SlackModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config) => config.get('slack'),
    }),
    NotifyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
