import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { request } from 'http';
import { AuthService } from './auth.service';
import { SignInDataDTO } from './dto/signInData.dto';
import { SignUpDataDTO } from './dto/signUpData.dto';
import SignInInterface from './interfaces/signIn.interface';
import { SignInGuard } from './signIn.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async signUp(@Body() signUpData: SignUpDataDTO) {
    return await this.authService.signUp(signUpData);
  }

  @Post('signIn')
  @UseGuards(SignInGuard)
  async signIn(
    @Req() req: SignInInterface,
    // @Body() signInData: SignInDataDTO
  ) {
    console.log(req.session);
    console.log(req.sessionID);
    // return await this.authService.signIn(req);
  }
}
