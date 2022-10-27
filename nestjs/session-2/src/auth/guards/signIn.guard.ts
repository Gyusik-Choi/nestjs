import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SignInGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check the email and the password
    await super.canActivate(context);
    // 여기까지는 signIn.guard.spec.ts 의 테스트가 통과하는데
    // await super.logIn(request) 는 통과하지 못하고 timeout 에 걸린다
    // await super.logIn(request) 이 코드를 주석처리하면 테스트를 통과한다
    // 이 코드가 왜 timeout 을 일으키는지 파악할 필요가 있다

    // initialize the session
    const request = context.switchToHttp().getRequest();

    await super.logIn(request);

    // if no exceptions were thrown, allow the access to the route
    return true;
  }
}
