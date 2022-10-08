import { Module } from '@nestjs/common';
import { PassportService } from './passport.service';

@Module({
  providers: [PassportService],
})
export class PassportModule {}
