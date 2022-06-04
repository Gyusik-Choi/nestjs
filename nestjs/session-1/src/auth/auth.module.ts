import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from '../entities/userAccount.entity';
import { Sessions } from 'src/entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount, Sessions])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
