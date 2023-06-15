import { Board } from "../entities/board.entity";
import { CustomRepository } from "../common/decorators/custom-repository.decorator";
import { Repository } from "typeorm";
import { InternalServerErrorException } from "@nestjs/common";

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {
  async paging(size: number, idx: number | undefined): Promise<[Board[], number]> {
    try {
      const queryBuilder = this
        .createQueryBuilder()
        .limit(size)
        .orderBy('idx', 'DESC')

      // no-offset 방식의 paging 을 위해 idx 값이 필요하다
      // 최초 요청시 idx 값이 없다
      // 문제는 idx 를 내림차순으로 조회하므로
      // idx 값이 없으면 where 조건에 걸 수 없다
      // DB 에서 최대 Idx 값이 얼마인지 알 수 없기 때문이다
      if (idx !== undefined) {
        queryBuilder.where('idx >= :idx', { idx })
      }

      return await queryBuilder.getManyAndCount();
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
