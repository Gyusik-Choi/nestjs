import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BanksModule } from './banks/banks.module';

@Module({
  imports: [TypeOrmModule.forRoot(), BanksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
