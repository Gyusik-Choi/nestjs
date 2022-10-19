import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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
    // console.log(req.session);
    // console.log(req.sessionID);
    return req.user;
  }

  @Get('authenticate')
  @UseGuards(AuthenticationGuard)
  async authenticate(@Req() req: AuthenticationInterface) {
    return req.user;
  }

  @Post('signOut')
  @UseGuards(AuthenticationGuard)
  async signOut(@Req() req: AuthenticationInterface) {
    // 참고한 소스코드에는 logOut 에 콜백 함수를 안 적어도 괜찮았는데
    // passport 버전의 차이로
    // index.d.ts 의 logout, logOut 구현이 달랐다
    // 참고한 소스코드에서 바라보는 passport 모듈의
    // index.d.ts 의 logout, logOut 구현은 아래와 같다 (소문자 o, 대문자 O 주의!)
    // =>
    // logout(): void;
    // logOut(): void;
    //
    // 이 프로젝트에서 바라보는 passport 모듈의
    // index.d.ts 의 logout, logOut 구현은 아래와 같다
    // =>
    // logout(options: { keepSessionInfo?: boolean }, done: (err: any) => void): void;
    // logout(done: (err: any) => void): void;
    // logOut(options: { keepSessionInfo?: boolean }, done: (err: any) => void): void;
    // logOut(done: (err: any) => void): void;

    // https://www.passportjs.org/concepts/authentication/logout/
    req.logOut((err) => {
      if (err) {
        throw new InternalServerErrorException();
      }
    });
    req.session.cookie.maxAge = 0;
  }
}
