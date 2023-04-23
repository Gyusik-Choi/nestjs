import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class BoardSearchRequestDTO {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  // https://stackoverflow.com/questions/73080334/how-to-set-default-values-on-dto-nestjs
  // default 값으로 1을 지정
  // request 에서 pageNumber 에 대한 값이 따로 지정되지 않으면 1이 된다
  private pageNumber = 1;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  // default 값으로 10 을 지정
  private pageSize = 10;

  getLimit(): number {
    return this.pageSize;
  }

  getOffset(): number {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
