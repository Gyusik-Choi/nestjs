import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";

export class BoardSearchRequestDTO {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  private pageNumber: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  private pageSize: number;

  getLimit(): number {
    return this.pageSize; 
  }

  getOffset(): number {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
