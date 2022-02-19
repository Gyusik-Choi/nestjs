import { IsNumber, IsString } from 'class-validator';

export class CreaetCompanyDTO {
  @IsNumber()
  founder: number;

  @IsString()
  name: string;
}
