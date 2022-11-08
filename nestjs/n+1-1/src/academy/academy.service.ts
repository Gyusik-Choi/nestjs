import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Academy } from '../entities/academy.entity';
import { Subject } from '../entities/subject.entity';

@Injectable()
export class AcademyService {
  constructor(
    @InjectRepository(Academy)
    private readonly academyRepository: Repository<Academy>,

    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async getAllAcademies(): Promise<Academy[]> {
    const academies: Academy[] = await this.academyRepository.find();

    for (const academy of academies) {
      const subject = await academy.subject;
    }

    return academies;
  }
}
