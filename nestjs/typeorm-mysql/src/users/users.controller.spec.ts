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
  let service: UsersService;
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
    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<MockRepository<UserAccount>>(
      getRepositoryToken(UserAccount)
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(usersRepository).toBeDefined();
  });

  describe('findAllUsers', () => {
    it('it should be called', async () => {
      const serviceCall = jest.spyOn(service, 'findAllUsers');
      await controller.findAllUsers();
      expect(serviceCall).toBeCalledTimes(1);
    });
  });

  describe('findUser', () => {
    it('it should be called', async () => {
      const serviceCall = jest.spyOn(service, 'findUser');
      await controller.findUser(1);
      expect(serviceCall).toBeCalledTimes(1);
    });

    // https://leocode.com/development/testing-node-with-jest/
    it('it should return something', async () => {
      const result = {
        id: 1,
        firstName: 'Bill',
        lastName: 'Gates',
        isActive: true,
      };
      jest.spyOn(controller, 'findUser').mockResolvedValue(result);
      expect(await controller.findUser(1)).toBe(result);
    });
  });

  describe('createUser', () => {
    it('it should create user', async () => {
      const user = {
        id: 5,
        firstName: 'Nest',
        lastName: 'JS',
        isActive: true,
      };

      jest.spyOn(controller, 'createUser').mockResolvedValue(user);
      expect(await controller.createUser(user)).toBe(user);
    });
  });
});
