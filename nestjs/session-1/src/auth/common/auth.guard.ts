import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpressSessions } from '../../entities/expressSessions.entity';
import { UserAccount } from '../../entities/userAccount.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(ExpressSessions)
    private readonly sessionRepository: Repository<ExpressSessions>,

    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const sessionID: string = request['sessionID'];

    let userID: number = null;

    try {
      const result: ExpressSessions = await this.sessionRepository.findOne({
        session_id: sessionID,
      });

      if (result === undefined) {
        throw new BadRequestException();
      }

      // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
      const parsedCookie: any = JSON.parse(result.data);
      userID = parsedCookie.userID;
    } catch (err) {
      return false;
    }

    try {
      const user: UserAccount = await this.userAccountRepository.findOne({
        id: userID,
      });

      if (user === undefined) {
        throw new BadRequestException();
      }
    } catch (err) {
      return false;
    }

    return request['session']['isAuthenticated'];
  }
}
