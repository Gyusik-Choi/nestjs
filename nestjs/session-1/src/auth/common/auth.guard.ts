import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sessions } from '../../entities/session.entity';
import { UserAccount } from '../../entities/userAccount.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(Sessions)
    private readonly sessionRepository: Repository<Sessions>,

    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const sessionID: string = request['sessionID'];

    let userID: number = null;

    try {
      const result: Sessions = await this.sessionRepository.findOne({
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
