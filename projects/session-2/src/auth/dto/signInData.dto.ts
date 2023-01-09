import { IsEmail, IsString } from 'class-validator';

export class SignInDataDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
