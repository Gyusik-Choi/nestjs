import { Injectable } from '@nestjs/common';
import { BoardSearchRequestDTO } from './dto/boardSearchRequest.dto';
import { BoardRepository } from '../repositories/board.repository';
import { Board } from '../entities/board.entity';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
  ) {}

  async search(queryParam: BoardSearchRequestDTO) {
    const boards: [Board[], number] = await this.boardRepository.paging(queryParam);
  }
}
