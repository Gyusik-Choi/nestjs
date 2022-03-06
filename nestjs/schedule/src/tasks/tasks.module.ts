import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [TasksService],
})
export class TasksModule {}
