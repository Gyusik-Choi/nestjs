import { Test, TestingModule } from '@nestjs/testing';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { BoardSearchRequestDTO } from './dto/boardSearchRequest.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BoardRepository } from '../repositories/board.repository';

const mockBoardRepository = () => ({});

describe('BoardController', () => {
  let controller: BoardController;
  let service: BoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardController],
      providers: [
        BoardService,
        {
          provide: getRepositoryToken(BoardRepository),
          useValue: mockBoardRepository(),
        },
      ],
    }).compile();

    controller = module.get<BoardController>(BoardController);
    service = module.get<BoardService>(BoardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('controller calls service', () => {
    it('service search method is called by controller', () => {
      jest.spyOn(service, 'search').mockResolvedValue(null);

      controller.search(new BoardSearchRequestDTO());
      expect(service.search).toBeCalled();
    });
  });
});
