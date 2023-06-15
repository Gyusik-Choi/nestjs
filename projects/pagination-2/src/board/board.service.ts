import { Injectable } from '@nestjs/common';
import { BoardSearchRequestDTO } from './dto/board-search-request.dto';
import { BoardRepository } from '../repositories/board.repository';
import { PageResponse } from 'src/common/interfaces/page-response';
import { BoardSearchReseponse } from './dto/board-search-response.dto';
import { Board } from '../entities/board.entity';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
  ) {}

  async search(req: BoardSearchRequestDTO) {
    const result: [Board[], number] = await this.boardRepository.paging(req.pageLimit, req.idx);
    const items: BoardSearchReseponse[] = result[0].map(v => new BoardSearchReseponse(v));
    return new PageResponse<BoardSearchReseponse>(
      result[1],
      req.pageLimit,
      items[items.length - 1].idx - 1,
      items,
    )
  }
}
