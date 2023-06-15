import { IsNumber, IsOptional } from "class-validator";
import { PageRequest } from "src/common/interfaces/page-request";

export class BoardSearchRequestDTO extends PageRequest {
  @IsOptional()
  @IsNumber()
  idx: number;
}
