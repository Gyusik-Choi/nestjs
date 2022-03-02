import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAccount } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreaetCompanyDTO } from './dto/create-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>
  ) {}

  async findAllCompanies(): Promise<Company[]> {
    // https://velog.io/@hkja0111/NestJS-08-TypeORM-QueryBuilder
    const allCompanies = await this.companyRepository
      .createQueryBuilder()
      .getMany();

    return allCompanies;
  }

  async createCompany(companyData: CreaetCompanyDTO) {
    // 방법 1
    // return this.companyRepository.save(companyData);
    // 방법 2
    // const connection = getConnection();
    // await connection
    //   .createQueryBuilder()
    //   .insert()
    //   .into(Company)
    //   .values(companyData)
    //   .execute();
    // 방법 3
    this.companyRepository
      .createQueryBuilder()
      .insert()
      .into(Company)
      .values(companyData)
      .execute();
  }

  async getCompaniesOfFounder(founderId: number) {
    const companies = await this.companyRepository
      .createQueryBuilder('company')
      // relation 이 없는 테이블 간의 join
      // https://typeorm.io/#/select-query-builder/joining-any-entity-or-table
      // https://github.com/typeorm/typeorm/issues/951
      // .innerJoinAndSelect('user_account', 'user', 'company.founder = user.id')
      // 위의 'user_account'는 실제 DB 테이블의 이름으로 접근하는 방법이고, 아래는 Entity 클래스의 이름이다
      .innerJoinAndSelect(UserAccount, 'user', 'company.founder = user.id')
      .where('company.founder = :founderId', { founderId: founderId })
      .getMany();

    return companies;
  }
}