import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from './entities/user.entity';
import { UsersService } from './users.service';

// https://velog.io/@1yongs_/NestJS-Testing-Jest
const mockUsersRepository = () => ({
  // https://velog.io/@baik9261/Nest-JS-JESTUnit-Test
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

  it('should be defined', () => {
    expect(usersRepository).toBeDefined();
  });

  describe('save', () => {
    it('should create new user', async () => {
      const user = { firstName: 'Bill', lastName: 'Gates', isActive: true };

      usersRepository.save.mockResolvedValue(user);
      const result = await service.createUser(user);

      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(user);
    });
  });

  describe('find', () => {
    it('should find users', async () => {
      usersRepository.find.mockResolvedValue([
        {
          id: 1,
          name: 'Bill',
        },
        {
          id: 2,
          name: 'Steve',
        },
        {
          id: 3,
          name: 'Elon',
        },
      ]);

      const result = await service.findAllUsers();

      expect(result.length).toBe(3);
      expect(result[0]['id']).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should find one user', async () => {
      const mockedUser = {
        id: 1,
        firstName: 'Steve',
        lastName: 'Jobs',
        isActive: true,
      };

      usersRepository.findOne.mockResolvedValue(mockedUser);
      const user = await service.findUser(1);

      expect(user).toEqual(mockedUser);
    });
  });
});
