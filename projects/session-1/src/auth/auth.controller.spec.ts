import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExpressSessions } from '../entities/expressSessions.entity';
import { UserAccount } from '../entities/userAccount.entity';
import { Repository } from 'typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './common/auth.guard';
// import { CanActivate, ExecutionContext } from '@nestjs/common';
// https://docs.nestjs.com/migration-guide
// import { HttpService } from '@nestjs/axios';
import * as bcrypt from 'bcrypt';
import * as httpMocks from 'node-mocks-http';

const mockUsersRepository = () => ({
  save: jest.fn(),
  findOne: jest.fn(),
});

const mockSessionsRepository = () => ({});

// const mockAuthGuard: CanActivate = {
//   canActivate: (context: ExecutionContext) => {
//     const request = context.switchToHttp().getRequest();
//     console.log('here');
//     return request.user;
//   },
// };

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let userAccountRepository: MockRepository<UserAccount>;
  let sessionsRepository: MockRepository<ExpressSessions>;

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
          provide: getRepositoryToken(ExpressSessions),
          useValue: mockSessionsRepository(),
        },
      ],
    })
      // https://lahuman.jabsiri.co.kr/353
      // .overrideGuard(AuthGuard)
      // .useValue(mockAuthGuard)
      .compile();

    // httpService = module.get<HttpService>(HttpService);
    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    userAccountRepository = module.get<MockRepository<UserAccount>>(
      getRepositoryToken(UserAccount),
    );
    sessionsRepository = module.get<MockRepository<ExpressSessions>>(
      getRepositoryToken(ExpressSessions),
    );
  });

  // it('should be defined', () => {
  //   expect(httpService).toBeDefined();
  // });

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
    it('should create new user', async () => {
      const inputData = {
        email: 'bill@ms.com',
        password: 'Abcde12345!',
      };

      userAccountRepository.findOne.mockResolvedValue([null, false]);
      userAccountRepository.save.mockResolvedValue(inputData);

      const result = await controller.signUp(inputData);
      expect(result).toEqual('회원 가입에 성공했습니다');
    });
  });

  describe('signIn', () => {
    it('should singIn', async () => {
      const request = httpMocks.createRequest({
        session: {
          isAuthenticated: false,
          userID: 'bill@ms.com',
        },
      });

      const email = 'bill@ms.com';
      const password = 'Abcde12345!';
      const hashedPassword: string = await bcrypt.hash(password, 10);

      const userInputData = {
        email: 'bill@ms.com',
        password: 'Abcde12345!',
      };

      const mockData = {
        email: email,
        password: hashedPassword,
      };

      userAccountRepository.findOne.mockResolvedValue(mockData);
      const result = await service.signIn(request, userInputData);
      expect(result).toEqual(true);
    });
  });

  // https://stackoverflow.com/questions/59767377/how-can-i-unit-test-that-a-guard-is-applied-on-a-controller-in-nestjs
  // auth guard 를 테스트하려 했지만 auth guard 테스트는 controller 테스트에서 수행하는게 옳지않아 보인다
  // auth guard 를 따로 테스트 하는게 나을 듯 하다
  // controller 에서 auth guard 를 거치려면 실제 http request 가 발생해야 하는데
  // 이를 위해서는 axios 와 같은 http request 를 할 수 있는 모듈에 대한 의존성을 만들어줘야 하는데
  // 테스트 파일에서만 이를 만들어서 수행할 수는 없다
  // 왜냐하면 이는 실제 코드 상의 의존성과 다르기 때문이다
  describe('guardTest', () => {
    it('should get instance of AuthGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        AuthController.prototype.guardTest,
      );

      const guard = new guards[0]();
      expect(guard).toBeInstanceOf(AuthGuard);
    });
  });
});
