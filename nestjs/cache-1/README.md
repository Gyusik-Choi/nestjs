# cache-1

### redis

#### 어떤 것을 골라야 할까?

cache-manager-redis-store

cache-manager-ioredis

...

[redis 관련 cache-manager](https://github.com/node-cache-manager/node-cache-manager#store-engines) 가 여러개 있어서 그 중 어떤 것을 골라야 할지부터 정하는게 쉽지 않았다.

```
cache-manager-redis-store does not support redis v4. In order for the ClientOpts interface to exist and work correctly you need to install the latest redis 3.x.x major release.
```

nestjs 공식문서에는 cache-manager-redis-store 가 나오는데, 아래와 같은 이슈가 있다고 하여 cache-manager-ioredis 를 선택했으나 cache-manager-ioredis 도 v4 의 redis 를 제대로 사용할 수 없어서 3.1.2 버전을 설치했다.

여기서 redis 버전은 자신의 컴퓨터에 설치된 레디스가 아니라 npm module 로서 설치한 redis 의 버전을 의미한다.

구글링으로 나오는 자료들에서는 npm i redis 를 수행하는 내용이 잘 나오지 않는데, redis 를 설치해야 정상적으로 cache module 과 redis 를 연결할 수 있다.

특히 ClientOpts type 을 CacheModule.register 에 선언해줘야 store 로 redisStore 를 에러 없이 등록할 수 있다. ClientOpts 를 선언하지 않으면 store 키에 에러가 발생한다.

```typescript
import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as redisStore from 'cache-manager-ioredis';
import type { ClientOpts } from 'redis';

@Module({
  imports: [
    // https://docs.nestjs.com/techniques/caching#different-stores
    CacheModule.register<ClientOpts>({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

<br>

#### store.get is not a function

[이 글](https://stackoverflow.com/questions/73908197/typeerror-store-get-is-not-a-function-nestjs-cache-manager)을 참고하여 cache-manager 의 버전을 v4 대로 낮춰서 해결할 수 있었다.

<br>



<br>

<참고>

https://docs.nestjs.com/techniques/caching

https://hwasurr.io/nestjs/caching/

https://blog.logrocket.com/add-redis-cache-nestjs-app/

https://medium.com/zigbang/nestjs%EC%9D%98-module%EA%B3%BC-cachemodule%EC%9D%84-%ED%99%9C%EC%9A%A9%ED%95%9C-redis-%EC%97%B0%EB%8F%99-2166a771196

https://github.com/node-cache-manager/node-cache-manager#store-engines

https://docs.nestjs.com/techniques/caching#different-stores

https://stackoverflow.com/questions/73908197/typeerror-store-get-is-not-a-function-nestjs-cache-manager

https://github.com/node-cache-manager/node-cache-manager/issues/210