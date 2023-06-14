import { Board } from "../entities/board.entity";
import { CustomRepository } from "../common/decorators/custom-repository.decorator";
import { Repository } from "typeorm";
import { InternalServerErrorException } from "@nestjs/common";

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {
  async paging(idx: number, size: number) {
    try {
      return await this
        .createQueryBuilder()
        .select(['idx', 'title', 'content'])
        .where('idx > :idx', { idx })
        .limit(size)
        .orderBy('idx', 'DESC')
        .getRawMany();
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
