import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from './entities/user.entity';
import { UsersService } from './users.service';

// https://velog.io/@1yongs_/NestJS-Testing-Jest
const mockUsersRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
});

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: MockRepository<UserAccount>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserAccount),
          useValue: mockUsersRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<MockRepository<UserAccount>>(
      getRepositoryToken(UserAccount)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
