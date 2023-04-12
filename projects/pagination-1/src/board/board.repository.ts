import { CustomRepository } from "../common/decorators/custom-repository.decorator";
import { Board } from "../entities/board.entity";
import { Repository } from "typeorm";
import { BoardSearchRequestDTO } from "./dto/boardSearchRequest.dto";
import { InternalServerErrorException } from "@nestjs/common";

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {
  async paging(queryParam: BoardSearchRequestDTO) {
    try {
      return await this
        .createQueryBuilder("board")
        .select(["board.idx", "board.title", "board.content"])
        .limit(queryParam.getLimit())
        .offset(queryParam.getOffset())
        .getManyAndCount();
    } catch (err) {
      throw new InternalServerErrorException(err, '서버 에러가 발생했습니다');
    }
  }
}
