import { CustomRepository } from "../../src/common/decorators/custom-repository.decorator";
import { Board } from "../../src/entities/board.entity";
import { Repository } from "typeorm";

@CustomRepository(Board)
export class UserRepository extends Repository<Board> {

}
