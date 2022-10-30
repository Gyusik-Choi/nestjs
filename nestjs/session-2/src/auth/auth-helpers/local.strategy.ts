import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserAccount } from '../../../src/entities/userAccount.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
    // super();
  }

  async validate(email: string, password: string): Promise<UserAccount> {
    return this.authService.getAuthenticatedUser(email, password);
  }
}
