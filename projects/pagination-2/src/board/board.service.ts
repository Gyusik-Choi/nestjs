import { Injectable } from '@nestjs/common';
import { BoardSearchRequestDTO } from './dto/board-search-request.dto';
import { BoardRepository } from '../repositories/board.repository';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
  ) {}

  async search(req: BoardSearchRequestDTO) {
    return await this.boardRepository.paging(req.pageLimit, req.idx);
  }
}
