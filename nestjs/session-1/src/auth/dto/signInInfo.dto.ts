import { IsString } from 'class-validator';

export class SignInInfo {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
