import { IsEmail, IsString } from 'class-validator';

export class SignUpDataDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
