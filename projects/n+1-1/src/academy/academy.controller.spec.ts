import { Test, TestingModule } from '@nestjs/testing';
import { AcademyController } from './academy.controller';

describe('AcademyController', () => {
  let controller: AcademyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcademyController],
    }).compile();

    controller = module.get<AcademyController>(AcademyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
