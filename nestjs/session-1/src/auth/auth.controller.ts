import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Session,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { UserInputDataDTO } from './dto/userInputData.dto';
import { AuthGuard } from './common/auth.guard';
import { SignInInfo } from './dto/signInInfo.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async signUp(@Body() userInputData: UserInputDataDTO) {
    return await this.authService.signUp(userInputData);
  }

  @Post('signIn')
  async signIn(
    // @Req() request: Request,
    @Body() signInInfo: SignInInfo,
    // https://stackoverflow.com/questions/66495537/nestjs-e2e-test-mock-session-decorator
    // 컨트롤러에서 세션 속성 자체가 nest 에 구현되어 있다는 것을 이글을 보다가 알게 됐다
    @Session() session: Record<string, any>,
  ) {
    return await this.authService.signIn(session, signInInfo);
  }

  @Post('test')
  // AuthGuard 에서 sessionID 에 대한 검사 + 해당 sessionID 를 전송한 유저가 DB 에 존재하는지 검사
  @UseGuards(AuthGuard)
  guardTest(@Req() req: Request, @Session() userSession: Record<string, any>) {
    console.log(req.session);
    console.log(userSession.id);
    return true;
  }
}
