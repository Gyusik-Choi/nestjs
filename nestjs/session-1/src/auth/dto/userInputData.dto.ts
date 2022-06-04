import { IsEmail, IsString } from 'class-validator';

export class UserInputDataDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
