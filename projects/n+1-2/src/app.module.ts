import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbConfigModule } from './db-config/db-config.module';

@Module({
  imports: [DbConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
