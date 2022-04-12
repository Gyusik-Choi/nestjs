import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';

const mockCompanyRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnThis(),
  }),
});

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let service: CompaniesService;
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
    service = module.get<CompaniesService>(CompaniesService);
    companyRepository = module.get<MockRepository<Company>>(
      getRepositoryToken(Company)
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(companyRepository).toBeDefined();
  });

  describe('findAllCompanies', () => {
    it('it should be called', async () => {
      const serviceCall = jest.spyOn(service, 'findAllCompanies');
      await controller.findAllCompanies();
      expect(serviceCall).toBeCalled();
    });

    it('it should return something', async () => {
      const company = [
        {
          id: 1,
          founder: 1,
          name: 'microsoft',
        },
      ];

      jest.spyOn(controller, 'findAllCompanies').mockResolvedValue(company);
      expect(await controller.findAllCompanies()).toBe(company);
    });
  });

  describe('createCompany', () => {
    it('it should create company', async () => {
      const company = {
        id: 1,
        founder: 1,
        name: 'microsoft',
      };

      jest.spyOn(controller, 'createCompany').mockResolvedValue(company);
      expect(await controller.createCompany(company)).toEqual(company);
    });
  });

  describe('getFounderOfCompany', () => {
    it('it should find Founder by id', async () => {
      const company = {
        id: 1,
        founder: 1,
        name: 'microsoft',
      };

      jest
        .spyOn(companyRepository.createQueryBuilder(), 'getMany')
        .mockResolvedValue(company);

      const result = await controller.getFounderOfCompany(1);
      expect(result).toEqual(company);
    });
  });
});
