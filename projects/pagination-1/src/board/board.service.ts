import { Injectable } from '@nestjs/common';
import { BoardSearchRequestDTO } from './dto/boardSearchRequest.dto';
import { BoardRepository } from '../repositories/board.repository';
import { Board } from '../entities/board.entity';
import { BoardSearchArticleDTO } from './dto/boardSearchArticle.dto';
import { Post } from './dto/post';

@Injectable()
export class BoardService {
  constructor(private readonly boardRepository: BoardRepository) {}

  async search(
    queryParam: BoardSearchRequestDTO,
  ): Promise<Post<BoardSearchArticleDTO>> {
    const boards: [Board[], number] = await this.boardRepository.paging(
      queryParam,
    );
    return new Post<BoardSearchArticleDTO>(
      boards[1],
      queryParam.getLimit(),
      boards[0].map((v) => new BoardSearchArticleDTO(v)),
    );
  }
}
