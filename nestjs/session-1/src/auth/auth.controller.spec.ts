import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sessions } from '../entities/session.entity';
import { UserAccount } from '../entities/userAccount.entity';
import { Repository } from 'typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockUsersRepository = () => ({
  save: jest.fn(),
  findOne: jest.fn(),
});

const mockSessionsRepository = () => ({});

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let userAccountRepository: MockRepository<UserAccount>;
  let sessionsRepository: MockRepository<Sessions>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserAccount),
          useValue: mockUsersRepository(),
        },
        {
          provide: getRepositoryToken(Sessions),
          useValue: mockSessionsRepository(),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    userAccountRepository = module.get<MockRepository<UserAccount>>(
      getRepositoryToken(UserAccount),
    );
    sessionsRepository = module.get<MockRepository<Sessions>>(
      getRepositoryToken(Sessions),
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(userAccountRepository).toBeDefined();
  });

  it('should be defined', () => {
    expect(sessionsRepository).toBeDefined();
  });
});
