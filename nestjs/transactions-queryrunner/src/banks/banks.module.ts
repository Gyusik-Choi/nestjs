import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanksController } from './banks.controller';
import { BanksService } from './banks.service';
import { BankAccount } from './entities/bank-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccount])],
  controllers: [BanksController],
  providers: [BanksService],
})
export class BanksModule {}
