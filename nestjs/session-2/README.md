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

### SignInGuard

로그인을 할때 @UseGuards 설정으로 SignInGuard 를 두면서 AuthService 에서 수행할 역할이 많이 없어졌다. SignInGuard 를 통해서 아이디, 비밀번호를 검사하고 세션 생성을 진행하기 때문에 AuthService 의 역할이 많이 줄었다. 물론 실제 서비스를 운영한다면 로그를 찍는 등 다양하게 해야할 기능들이 있을 것이다. 

이번 프로젝트에서는 아이디, 비밀번호 검사 및 세션 생성을 모두 Guard 에서 하면서 사실상 AuthService 에서 로그인 관련 처리를 할 내용들이 없어졌다.

<br>

### AuthenticationGuard

클라이언트에게 발급한 세션 ID 의 유효성을 검사한다. 세션 정보는 서버에서 갖고 있고, 클라이언트는 세션 ID 만 전달받게 되는데 이 ID 를 바탕으로 세션이 유효한지를 AuthenticationGuard 에서 검사한다. 로그인이 유효한 상태인지 검사한 후에 controller 에서 요청을 받길 원하는 곳에서 이 Guard 를 활용할 수 있다.

<br>

### redis 에러 - the client is closed

3.1.2 버전으로 설치해야 한다.

<br>

### passport 모듈의 req.user 타입 문제

[이분](https://techbless.github.io/2020/04/07/TypeScript에서-Passport이용시-req-user-타입-문제-해결하기/)의 글을 통해 쉽게 해결할 수 있었다. auth controller 의 signIn, authenticate 에서 req.user 를 리턴하는데 이때 타입을 지정하면 에러가 발생하는 문제가 있었다. 

<br>

```typescript
// @types/passport/index.d.ts
declare global {
    namespace Express {
        // tslint:disable-next-line:no-empty-interface
        interface AuthInfo {}
        // tslint:disable-next-line:no-empty-interface
        interface User {}

        interface Request {
            authInfo?: AuthInfo | undefined;
            user?: User | undefined;
        }
    }
}
```

user 는 DB 와 연결된 UserAccount 객체인데 passport 모듈의 타입을 정의한 @types/passport/index.d.ts 의 코드를 보면 User 인터페이스는 빈 객체다. Request 인터페이스의 user 는 빈 객체인 User 혹은 undefined 로 정의되어 있다. 그래서 req.user 의 타입이 UserAccount 가 될 수 없다고 하게된다. 이를 해결하기 위해 User 가 UserAccount 를 상속하도록 타입을 새롭게 정의해주면 된다.

[이분](https://darrengwon.tistory.com/109)의 글을 통해 쉽게 타입을 정의할 수 있었다. 타입을 새롭게 정의하려면 tsconfig 파일의 typeRoots 속성을 추가해서 내가 정의한 타입을 바라볼 수 있도록 설정해줘야 하는데, 주의할 점은 내가 생성한 타입 파일 외에 node modules 의 @types 폴더도 함께 넣어줘야 한다.

<br>

### AuthGuard('local')

AuthGuard('local') -> LocalStrategy(validate 함수) -> PassportSerializer(serializerUser 함수) -> AuthGuard('local')

AuthGuard('local') 에서 await super.logIn(request) 를 통해 passport 모듈의 http/request.js 의 logIn 함수 호출한다. 어떻게 request.js 의 logIn 까지 올 수 있는지 중간 과정을 잘 모르겠다. 그러나 이 함수에 도달해야 여기서 sessionmanager.js 에 정의된 SessionManager 의 login 함수를 호출하게 된다. 그리고 SessionManager 의 login 함수에서 serializerUser 함수를 호출한다. 이 함수의 콜백 함수를 통해 request 객체의 session 객체 안에 프로퍼티를 설정해준다. 프로퍼티의 key 로 self._key 로 설정된 값(사용자가 따로 인자로 넘기지 않으면 passport 로 설정됨) 을 설정한다. 그리고 PassportSerializer 에 작성한 serializeUser 함수의 콜백 함수인 done 의 두번째 인자로 설정한 값을 받아서 value 로 넣어준다.

<br>

### timeout

signIn.guard.spec.ts 파일의 guard 테스트 코드에서 해당 에러가 발생했다. passport 모듈에서 request 객체의 login 함수를 호출하는데 이를 위해request 를 모킹한 객체에 logIn: jest.fn() 속성을 추가하면서 문제가 됐다. 내부 코드를 보면 promise 를 리턴해주는데 logIn: jest.fn() 으로 인해 제대로 promise 를 리턴하지 못하는 것으로 보인다. passport 모듈에서 직접 하는 동작을 그대로 두기 위해 logIn: jest.fn() 을 지우니 timeout 은 해결 됐는데 아래의 추가적인 문제가 발생했다.

<br>

### req.session.regenerate is not a function

signIn.guard.spec.ts 파일에서 guard 테스트를 진행하던 중 해당 에러가 발생했는데, 이는 passport 모듈의 버전을 낮춰서 해결할 수 있었다. 기존에 설치한 버전이 0.6.0 이었는데 0.5.x 으로 낮추라는 passport 모듈의 개발자가 직접 한 [답변](https://github.com/jaredhanson/passport/issues/907)이다.

해당 에러를 해결한 뒤 아래의 에러가 추가로 발생했다.

<br>

### Failed to serialize user into session

단위 테스트에 passport 의 serializeUser 함수가 구현되어 있지 않아서 문제가 됐다. 

beforeAll 에 serializeUser 를 추가해서 해결할 수 있었고, 마침내 테스트를 통과할 수 있었다.

```typescript
  beforeAll(() => {
    passport.use('local', new MockStrategy());
    // https://stackoverflow.com/questions/19948816/passport-js-error-failed-to-serialize-user-into-session
    passport.serializeUser(function (user, done) {
      done(null, user);
    });
  });
```

<br>

### e2e test

#### authenticate

signUp, signIn 은 통과했으나, authenticate 는 통과하지 못했었다.

passport 모듈 소스코드를 살펴보면서 request 객체나 request.session 에 user 정보 등이 없는것이 원인일 것이라 생각했으나 결론은 request.header 의 Cookie 설정이었다.

signIn 에서 얻은 쿠키 정보를 authenticate 요청시 Cookie 에 담아서 보내면서 해결할 수 있었다.

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

https://sarc.io/index.php/forum/tips/30058-redis-node-js-clientclosederror-the-client-is-closed

https://techbless.github.io/2020/04/07/TypeScript에서-Passport이용시-req-user-타입-문제-해결하기/

https://darrengwon.tistory.com/109

https://stackoverflow.com/questions/72375564/typeerror-req-session-regenerate-is-not-a-function-using-passport

https://github.com/jaredhanson/passport/issues/907

