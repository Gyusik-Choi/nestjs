import { IsNumber, IsString } from 'class-validator';

export class CreateCompanyDTO {
  @IsNumber()
  founder: number;

  @IsString()
  name: string;
}
