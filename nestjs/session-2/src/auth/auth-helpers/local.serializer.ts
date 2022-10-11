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

  async deserializeUser(email: string, done: CallableFunction) {
    const user = await this.authService.getByEmail(email);
    done(null, user);
  }
}
