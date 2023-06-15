import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export abstract class PageRequest {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  pageSize = 10;

  get pageLimit() {
    return this.pageSize;
  }
}
