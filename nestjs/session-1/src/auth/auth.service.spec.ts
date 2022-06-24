import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserAccount } from '../entities/userAccount.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';

const mockUsersRepository = () => ({
  // https://velog.io/@baik9261/Nest-JS-JESTUnit-Test
  signUp: jest.fn(),
  isEmailExist: jest.fn(),
  isEmail: jest.fn(),
  isPasswordValidate: jest.fn(),
  saveUser: jest.fn(),
  signIn: jest.fn(),
  userExist: jest.fn(),
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
      //
    });
  });

  describe('isEmailExist', () => {
    it('should know wheter user exists', async () => {
      //
    });
  });

  describe('isEmail', () => {
    it('should know wheter email is valid', async () => {
      //
    });
  });

  describe('isPasswordValidate', () => {
    it('should know wheter password is valid', async () => {
      //
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
