import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserAccount } from '../../src/entities/userAccount.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { SignUpDataDTO } from './dto/signUpData.dto';

const mockUserAccountRepository = async () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AuthService', () => {
  let service: AuthService;
  let userAccountRepository: MockRepository<UserAccount>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserAccount),
          useValue: mockUserAccountRepository(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userAccountRepository = module.get<MockRepository<UserAccount>>(
      getRepositoryToken(UserAccount),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(userAccountRepository).toBeDefined();
  });

  describe('signUp', () => {
    it('create new user', async () => {
      const signUpData: SignUpDataDTO = {
        email: 'bill@ms.com',
        password: 'Abcde12345!',
      };

      userAccountRepository.findOne.mockResolvedValue(null);
      userAccountRepository.save.mockResolvedValue(true);

      const result = await service.signUp(signUpData);
      expect(result).toEqual('회원 가입에 성공했습니다');
    });
  });
});
