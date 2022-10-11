# session-2

### db-config

DB 연결을 db-config 라는 별도의 모듈을 통해 수행했다. 

그간 ormconfig.json 혹은 ormconfig.js 파일을 통해 DB 연결을 해왔는데 이를 좀 더 모듈화 해보고 싶어서 찾아보던 중에 nestjs 공식문서에도 소개되는 방법을 시도했다. 

TypeOrmOptionsFactory 인터페이스를 implements 한 클래스 파일을 생성하고 TypeOrmOptionsFactory 에 정의된 추상 메소드인 createTypeOrmOptions 를 통해 DB 연결 정보를 return 한다. 그리고 app.module.ts 파일의 imports 속성에 TypeOrmModule.forRootAsync() 를 통해 위에서 작성한 db-config 정보를 비동기적인 방식으로 동작하게 설정한다.

<br>

### error: unknown authentication strategy local

AuthModule 의 providers 에 LocalStrategy, LocalSerializer 를 작성하지 않아서 발생한 에러였다.

<br>

### SignInGuard

[이분](https://adoreje.tistory.com/6) 의 글을 통해서 

AuthGuard('local') 를 상속받은 SignInGuard => PassportStrategy(Strategy) 를 상속받은 LocalStrategy 로 이어짐을 알 수 있었다.

AuthGuard('local') 에서 PassportStrategy(Strategy) 를 찾는다.

<br>

### AuthGuard('local') - canActivate

위에서 AuthGuard('local') => PassportStrategy(Strategy) 로 이어진다고 했는데, 이는 다시 PassportStrategy(Strategy) => PassportSerializer 로 이어진다.

PassportSerializer 는 추상 클래스이고 실제로는 이를 구현한 클래스로 이어지는데 여기서 serializeUser 의 구현을 통해서 Session 에 저장할 값을 지정해줄 수 있다.

> We need to specify the exact data we want to keep inside the session. To manage it, we need to create a **serializer**.

<br>

```typescript
@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: UserAccount, done: CallableFunction) {
    done(null, user.id);
  }
}

```

serializeUser 에서 user.id 를 콜백 함수의 인자로 넘겨주면서 user.id 를 Session 에 저장되도록 한다. 다만 이는 무조건 되지 않는다.

<br>

```typescript
@Injectable()
export class SignInGuard extends AuthGuard('local') {}

```

```
Session {
  cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true }
}
```

AuthGuard('local') 을 구현한 SignInGuard 에 아무것도 작성하지 않았을 때 로그인 후 Session 값을 살펴보면 user.id 값이 보이지 않는다.

<br>

```typescript
@Injectable()
export class SignInGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check the email and the password
    await super.canActivate(context);

    // initialize the session
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);

    // if no exceptions were thrown, allow the access to the route
    return true;
  }
}
```



```
Session {
  cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true },
  passport: { user: 1 }
}
```

<br>

AuthGuard('local') 을 구현한 SignInGuard 에 canActivate 함수를 만들고 로직을 작성하니 Session 에 위에는 없었던 user.id 값이 생성됐다. canActivate 의 구현 부분을 아직 제대로 이해하지 못했다.

<br>

<참고>

https://docs.nestjs.com/techniques/database

https://docs.nestjs.com/techniques/caching#different-stores

https://github.com/dabroek/node-cache-manager-redis-store/issues/40

https://dnlytras.com/snippets/redis-session/

https://dev.to/nestjs/setting-up-sessions-with-nestjs-passport-and-redis-210

https://www.loginradius.com/blog/engineering/guest-post/session-authentication-with-nestjs-and-mongodb/

https://inpa.tistory.com/entry/NODE-📚-Passport-모듈-그림으로-처리과정-💯-이해하자

http://www.passportjs.org/concepts/authentication/sessions/

https://wanago.io/2021/06/07/api-nestjs-server-side-sessions-instead-of-json-web-tokens/

https://stackoverflow.com/questions/40381401/when-to-use-saveuninitialized-and-resave-in-express-session

https://stackoverflow.com/questions/38820251/how-is-req-isauthenticated-in-passport-js-implemented

https://github.com/jaredhanson/passport/blob/a892b9dc54dce34b7170ad5d73d8ccfba87f4fcf/lib/passport/http/request.js#L74

https://stackoverflow.com/questions/69788605/nestjs-error-unknown-authentication-strategy-local

https://adoreje.tistory.com/6