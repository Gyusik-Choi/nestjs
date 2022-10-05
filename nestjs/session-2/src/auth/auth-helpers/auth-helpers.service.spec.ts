import { Test, TestingModule } from '@nestjs/testing';
import { AuthHelpersService } from './auth-helpers.service';

describe('AuthHelpersService', () => {
  let service: AuthHelpersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthHelpersService],
    }).compile();

    service = module.get<AuthHelpersService>(AuthHelpersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
