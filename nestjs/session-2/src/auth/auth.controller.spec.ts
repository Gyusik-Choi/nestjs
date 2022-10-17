import { Test, TestingModule } from '@nestjs/testing';
import { UserAccount } from '../../src/entities/userAccount.entity';
import { Repository } from 'typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDataDTO } from './dto/signUpData.dto';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockUserAccountRepository = async () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let userAccountRepository: MockRepository<UserAccount>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserAccount),
          useValue: mockUserAccountRepository(),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    userAccountRepository = module.get<MockRepository<UserAccount>>(
      getRepositoryToken(UserAccount),
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('success signUp', async () => {
      const signUpData: SignUpDataDTO = {
        email: 'bill@ms.com',
        password: 'Abcde12345!',
      };

      jest
        .spyOn(service, 'signUp')
        .mockResolvedValue('회원 가입에 성공했습니다');

      const result = await controller.signUp(signUpData);
      expect(result).toEqual('회원 가입에 성공했습니다');
    });
  });
});
