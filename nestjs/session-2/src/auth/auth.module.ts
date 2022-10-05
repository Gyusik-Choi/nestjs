import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthHelpersModule } from './auth-helpers/auth-helpers.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [AuthHelpersModule]
})
export class AuthModule {}
