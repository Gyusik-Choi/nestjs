import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from '../entities/userAccount.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalSerializer } from './auth-helpers/local.serializer';
import { LocalStrategy } from './auth-helpers/local.strategy';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([UserAccount])],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, LocalSerializer],
})
export class AuthModule {}
