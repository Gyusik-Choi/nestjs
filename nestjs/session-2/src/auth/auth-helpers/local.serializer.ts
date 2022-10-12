import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserAccount } from '../../entities/userAccount.entity';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: UserAccount, done: CallableFunction) {
    done(null, user.id);
  }

  async deserializeUser(id: number, done: CallableFunction) {
    const user = await this.authService.getById(id);
    done(null, user);
  }
}
