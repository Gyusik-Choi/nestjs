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
    // Lazy Loading 에서 N + 1 을 피하는 방법 1
    // const academies: Academy[] = await this.academyRepository.find({
    //   relations: ['subject'],
    // });

    // for (const academy of academies) {
    //   await academy.subject;
    // }

    // return academies;

    // Lazy Loading 에서 N + 1 을 피하는 방법 2
    // return this.academyRepository
    //   .createQueryBuilder('academy')
    //   .leftJoinAndSelect('academy.subject', 'subject')
    //   .getMany();

    return this.academyRepository.createQueryBuilder('academy').getMany();
  }
}
