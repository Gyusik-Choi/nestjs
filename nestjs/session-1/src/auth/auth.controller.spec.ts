import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sessions } from '../entities/session.entity';
import { UserAccount } from '../entities/userAccount.entity';
import { Repository } from 'typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './common/auth.guard';
import { CanActivate, ExecutionContext } from '@nestjs/common';

const mockUsersRepository = () => ({
  save: jest.fn(),
  findOne: jest.fn(),
});

const mockSessionsRepository = () => ({});

const mockAuthGuard: CanActivate = {
  canActivate: (context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log(request);
    return request.user;
  },
};

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
    })
      // https://lahuman.jabsiri.co.kr/353
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

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

  describe('signUp', () => {
    it('it should create new user', async () => {
      // const mockResult = '회원 가입에 성공했습니다';
      // const serviceCall = jest
      //   .spyOn(service, 'signUp')
      //   .mockResolvedValue(mockResult);

      // const inputData = {
      //   email: 'bill@ms.com',
      //   password: 'Abcde12345!',
      // };

      // const result = await controller.signUp(inputData);
      // expect(serviceCall).toBeCalledTimes(1);
      // expect(result).toEqual(mockResult);

      const inputData = {
        email: 'bill@ms.com',
        password: 'Abcde12345!',
      };

      const successResult: string = await controller.signUp(inputData);

      expect(successResult).toEqual('회원 가입에 성공했습니다');
    });
  });
});
