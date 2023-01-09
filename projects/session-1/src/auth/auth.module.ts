import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from '../entities/userAccount.entity';
import { ExpressSessions } from '../entities/expressSessions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount, ExpressSessions])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
