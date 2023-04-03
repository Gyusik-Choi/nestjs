import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './board/board.module';
import { DbConfigModule } from './db-config/db-config.module';

@Module({
  imports: [BoardModule, DbConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
