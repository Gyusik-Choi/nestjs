import { CustomRepository } from "../common/decorators/custom-repository.decorator";
import { Board } from "../entities/board.entity";
import { Repository } from "typeorm";
import { BoardSearchRequestDTO } from "./dto/boardSearchRequest.dto";

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {
  paging(queryParam: BoardSearchRequestDTO) {
    
  }
}
