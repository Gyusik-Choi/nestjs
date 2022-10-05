import { Module } from '@nestjs/common';
import { AuthHelpersService } from './auth-helpers.service';

@Module({
  providers: [AuthHelpersService]
})
export class AuthHelpersModule {}
