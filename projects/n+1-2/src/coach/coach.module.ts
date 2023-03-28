import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coach } from 'src/entities/coach.entity';
import { CoachController } from './coach.controller';
import { CoachService } from './coach.service';

@Module({
  imports: [TypeOrmModule.forFeature([Coach])],
  controllers: [CoachController],
  providers: [CoachService]
})
export class CoachModule {}
