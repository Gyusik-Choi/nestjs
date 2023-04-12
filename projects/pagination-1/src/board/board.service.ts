import { Injectable } from '@nestjs/common';
import { BoardSearchRequestDTO } from './dto/boardSearchRequest.dto';
import { BoardRepository } from './board.repository';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
  ) {}

  async search(queryParam: BoardSearchRequestDTO) {
    return await this.boardRepository.paging(queryParam);
  }
}
