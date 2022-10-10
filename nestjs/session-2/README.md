# session-2

### db-config

DB 연결을 db-config 라는 별도의 모듈을 통해 수행했다. 

그간 ormconfig.json 혹은 ormconfig.js 파일을 통해 DB 연결을 해왔는데 이를 좀 더 모듈화 해보고 싶어서 찾아보던 중에 nestjs 공식문서에도 소개되는 방법을 시도했다. 

TypeOrmOptionsFactory 인터페이스를 implements 한 클래스 파일을 생성하고 TypeOrmOptionsFactory 에 정의된 추상 메소드인 createTypeOrmOptions 를 통해 DB 연결 정보를 return 한다. 그리고 app.module.ts 파일의 imports 속성에 TypeOrmModule.forRootAsync() 를 통해 위에서 작성한 db-config 정보를 비동기적인 방식으로 동작하게 설정한다.

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