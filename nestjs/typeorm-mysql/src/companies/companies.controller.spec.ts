import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';

const mockCompanyRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
});

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let companyRepository: MockRepository<Company>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        CompaniesService,
        {
          provide: getRepositoryToken(Company),
          useValue: mockCompanyRepository(),
        },
      ],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
    companyRepository = module.get<MockRepository<Company>>(
      getRepositoryToken(Company)
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
