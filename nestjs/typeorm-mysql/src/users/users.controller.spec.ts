import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUsersRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
});

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersController', () => {
  let controller: UsersController;
  let usersRepository: MockRepository<UserAccount>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserAccount),
          useValue: mockUsersRepository(),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersRepository = module.get<MockRepository<UserAccount>>(
      getRepositoryToken(UserAccount)
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
