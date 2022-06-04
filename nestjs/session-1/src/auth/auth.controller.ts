import {
  Body,
  Controller,
  Post,
  Req,
  Session,
  UseFilters,
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
  async signIn(@Req() request: Request, @Body() signInInfo: SignInInfo) {
    return await this.authService.signIn(request, signInInfo);
  }

  @Post('test')
  // AuthGuard 에서 sessionID 에 대한 검사 + 해당 sessionID 를 전송한 유저가 DB 에 존재하는지 검사
  @UseGuards(AuthGuard)
  guardTest(@Req() req: Request, @Session() userSession: Record<string, any>) {
    console.log(req.session);
    console.log(userSession.id);
    console.log(userSession.sessionID);
    return true;
  }
}
