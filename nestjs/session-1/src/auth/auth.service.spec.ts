import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from '../entities/userAccount.entity';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

const mockUsersRepository = async () => ({
  // https://velog.io/@1yongs_/NestJS-Testing-Jest
  // https://velog.io/@baik9261/Nest-JS-JESTUnit-Test
  save: jest.fn(),
  findOne: jest.fn(),
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
          useValue: mockUsersRepository(),
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
    it('should create new user', async () => {
      const password = 'Abcde12345!';
      const hashedPassword: string = await bcrypt.hash(password, 10);

      const userData = {
        email: 'bill@ms.com',
        password: hashedPassword,
      };

      // save 는 typeorm 의 repository 에서 제공하는 함수가 아니라
      // jest 에서 제공하는 mockResolvedValue 를 사용할 수 있도록
      // mocking 할 repository 의 함수로 정의해줘야 한다
      userAccountRepository.save.mockResolvedValue(userData);
      const result = await service.saveUser(userData);

      expect(userAccountRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual([null, userData]);
    });
  });

  describe('isEmailExist', () => {
    it('should know wheter user exists', async () => {
      const email = 'bill@ms.com';
      const password = 'Abcde12345!';
      const hashedPassword: string = await bcrypt.hash(password, 10);

      const userData = {
        email: email,
        password: hashedPassword,
      };

      userAccountRepository.findOne.mockResolvedValue(userData);
      const result: [Error, null] | [null, boolean] =
        await service.isEmailExist(email);

      expect(result[1]).toBeTruthy;
    });
  });

  describe('isEmail', () => {
    it('should know wheter email is valid', async () => {
      const email = 'bill@ms.com';
      const isEmailResult: boolean = service.isEmail(email);

      expect(isEmailResult).toBeTruthy;

      const wrongEmail = 'bill';
      const isEmailResult2: boolean = service.isEmail(wrongEmail);

      expect(isEmailResult2).toBeFalsy;
    });
  });

  describe('isPasswordValidate', () => {
    it('should know wheter password is valid', async () => {
      const wrondPassword1 = '12345';
      const wrondPassword2 = 'abcde';
      const wrondPassword3 = '12345abcde';
      const wrondPassword4 = '12345abcde!';

      expect(wrondPassword1).toBeFalsy;
      expect(wrondPassword2).toBeFalsy;
      expect(wrondPassword3).toBeFalsy;
      expect(wrondPassword4).toBeFalsy;

      const password = 'Abcde12345!';

      expect(password).toBeTruthy;
    });
  });

  describe('saveUser', () => {
    it('should save user', async () => {
      const password = 'Abcde12345!';
      const hashedPassword: string = await bcrypt.hash(password, 10);

      const userData = {
        email: 'bill@ms.com',
        password: hashedPassword,
      };

      //https://stackoverflow.com/questions/55232833/how-to-test-if-a-void-async-function-was-successful-with-jest
      expect(await service.saveUser(userData)).resolves.not.toThrow;
    });
  });

  describe('signIn', () => {
    it('should signIn', async () => {
      //
    });
  });

  describe('userExist', () => {
    it('should know whether user exists', async () => {
      userAccountRepository.findOne.mockResolvedValue({
        email: 'bill@ms.com',
        password: 'Abcde12345!',
      });

      const email = 'bill@ms.com';
      const serviceResult = await service.userExist(email);
      const mockRespositoryResult = await userAccountRepository.findOne(email);

      expect(serviceResult[1]).toEqual(mockRespositoryResult);
    });
  });
});
