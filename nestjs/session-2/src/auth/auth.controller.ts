import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDataDTO } from './dto/signUpData.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async signUp(@Body() signUpData: SignUpDataDTO) {
    return await this.authService.signUp(signUpData);
  }
}
