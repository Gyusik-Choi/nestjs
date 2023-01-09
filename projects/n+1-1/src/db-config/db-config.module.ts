import { Module } from '@nestjs/common';
import { DbConfigService } from './db-config.service';

@Module({
  providers: [DbConfigService]
})
export class DbConfigModule {}
