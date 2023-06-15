import { IsNumber, IsOptional } from "class-validator";
import { PageRequest } from "../../common/interfaces/page-request";

export class BoardSearchRequestDTO extends PageRequest {
  @IsNumber()
  @IsOptional()
  idx: number;
}
