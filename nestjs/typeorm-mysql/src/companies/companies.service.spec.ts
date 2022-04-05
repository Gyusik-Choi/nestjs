import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompaniesService } from './companies.service';
import { CreateCompanyDTO } from './dto/create-company.dto';
import { Company } from './entities/company.entity';

// https://velog.io/@hkja0111/NestJS-11-Unit-Test-QueryBuilder
// https://github.com/typeorm/typeorm/issues/1774
// https://www.carloscaballero.io/part-9-clock-in-out-system-testing-backend-unit-test-services/

const mockCompanyRepository = () => ({
  find: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnThis(),
  }),
});

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('CompaniesService', () => {
  let service: CompaniesService;
  let companyRepository: MockRepository<Company>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getRepositoryToken(Company),
          useValue: mockCompanyRepository(),
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    companyRepository = module.get<MockRepository<Company>>(
      getRepositoryToken(Company)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(companyRepository).toBeDefined();
  });

  describe('findAllCompanies', () => {
    it('it should find companies', async () => {
      const companies = [
        {
          id: 1,
          founder: 'bill',
          name: 'microsoft',
        },
      ];

      companyRepository.find.mockResolvedValue(companies);

      const result = await service.findAllCompanies();
      expect(result).toEqual(companies);
    });
  });

  describe('createCompany', () => {
    it('it should create company', async () => {
      const company: CreateCompanyDTO = {
        founder: 3,
        name: 'neuralink',
      };
      // https://velog.io/@1yongs_/NestJS-Testing-Jest
      // mockResolvedValue 를 통해서 save로 저장될 테스트 객체를 미리 설정
      companyRepository.save.mockResolvedValue(company);
      const result = await service.createCompany(company);

      expect(companyRepository.save).toHaveBeenCalledTimes(1);
      expect(companyRepository.save).toHaveBeenCalledWith(company);
      expect(result).toEqual(company);
    });
  });

  describe('getCompaniesOfFounder', () => {
    beforeEach(async () => {
      await service.getCompaniesOfFounder(1);
    });

    it('it should call innerJoinAndSelect', async () => {
      expect(
        companyRepository.createQueryBuilder().innerJoinAndSelect
      ).toHaveBeenCalledTimes(1);
    });

    it('it should return result', async () => {
      const value = {
        id: 1,
        founder: 1,
        name: 'microsoft',
      };

      jest
        .spyOn(companyRepository.createQueryBuilder(), 'getMany')
        .mockResolvedValue(value);

      const result = await service.getCompaniesOfFounder(1);

      expect(companyRepository.createQueryBuilder().getMany).toHaveBeenCalled();
      expect(result).toEqual(value);
    });
  });
});
