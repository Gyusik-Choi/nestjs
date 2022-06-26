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

      // save.mockResolvedValue
      userAccountRepository.save.mockResolvedValue(userData);
      const result = await service.saveUser(userData);
      console.log(result);
      expect(userAccountRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('isEmailExist', () => {
    it('should know wheter user exists', async () => {
      //
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
      //
    });
  });

  describe('signIn', () => {
    it('should signIn', async () => {
      //
    });
  });

  describe('userExist', () => {
    it('should know whether user exists', async () => {
      //
    });
  });
});
