import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from '../entities/subject.entity';
import { Academy } from '../entities/academy.entity';
import { AcademyController } from './academy.controller';
import { AcademyService } from './academy.service';

@Module({
  // TypeORMError: Entity metadata for Subject#academy was not found. Check if you specified a correct entity object and if it's connected in the connection options.
  imports: [TypeOrmModule.forFeature([Academy, Subject])],
  controllers: [AcademyController],
  providers: [AcademyService],
})
export class AcademyModule {}
