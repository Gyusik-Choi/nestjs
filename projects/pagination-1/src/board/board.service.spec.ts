import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BoardRepository } from '../repositories/board.repository';
import { Board } from '../entities/board.entity';
import { BoardSearchRequestDTO } from './dto/boardSearchRequest.dto';

const mockBoardRepository = () => ({
  paging: jest.fn(),
});

describe('BoardService', () => {
  let service: BoardService;
  let boardRepository: BoardRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        {
          provide: getRepositoryToken(BoardRepository),
          useValue: mockBoardRepository(),
        },
      ],
    }).compile();

    service = module.get<BoardService>(BoardService);
    boardRepository = module.get<BoardRepository>(BoardRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    it('search method get 10 Post item', async () => {
      const mockResult: [Record<string, any>[], number] = [
        [
          { idx: 1, title: '제목1', content: '내용1' },
          { idx: 2, title: '제목2', content: '내용2' },
          { idx: 3, title: '제목3', content: '내용3' },
          { idx: 4, title: '제목4', content: '내용4' },
          { idx: 5, title: '제목5', content: '내용5' },
          { idx: 6, title: '제목6', content: '내용6' },
          { idx: 7, title: '제목7', content: '내용7' },
          { idx: 8, title: '제목8', content: '내용8' },
          { idx: 9, title: '제목9', content: '내용9' },
          { idx: 10, title: '제목10', content: '내용10' },
        ],
        50000,
      ];

      const mockBoards: Board[] = mockResult[0].map((v) => {
        const board: Board = new Board();
        board.idx = v.idx;
        board.title = v.title;
        board.content = v.content;
        return board;
      });

      jest
        .spyOn(boardRepository, 'paging')
        .mockResolvedValue([mockBoards, mockResult[1]]);

      const result = await service.search(new BoardSearchRequestDTO());
      expect(result.totalCount).toEqual(50000);
      expect(result.totalPage).toEqual(5000);
      expect(result.pageSize).toEqual(10);
      expect(result.articles.length).toEqual(10);
    });
  });
});
