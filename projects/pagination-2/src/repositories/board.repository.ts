import { Board } from "../../src/entities/board.entity";
import { CustomRepository } from "../../src/common/decorators/custom-repository.decorator";
import { Repository } from "typeorm";
import { InternalServerErrorException } from "@nestjs/common";

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {
  async paging(idx: number, size: number) {
    try {
      await this
        .createQueryBuilder()
        .select(['idx', 'title', 'content'])
        .where('idx > :idx', { idx })
        .limit(size)
        .getRawMany();
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
