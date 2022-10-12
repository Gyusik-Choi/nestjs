import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDataDTO } from './dto/signUpData.dto';
import SignInInterface from './interfaces/signIn.interface';
import { SignInGuard } from './guards/signIn.guard';
import { AuthenticationGuard } from './guards/authentication.guard';
import AuthenticationInterface from './interfaces/authentication.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async signUp(@Body() signUpData: SignUpDataDTO) {
    return await this.authService.signUp(signUpData);
  }

  @Post('signIn')
  @UseGuards(SignInGuard)
  async signIn(@Req() req: SignInInterface) {
    console.log(req.session);
    console.log(req.sessionID);
    return req.user;
  }

  @Get('authenticate')
  @UseGuards(AuthenticationGuard)
  async authenticate(@Req() req: AuthenticationInterface) {
    return req.user;
  }
}
