# Pagination - 2

### forRootAsync

NestJS 에서 TypeORM 사용을 위해 NestJS 자체에서 TypeOrmModule 을 제공한다. DB 연결도 TypeOrmModule 의 메소드를 이용해서 할 수 있다. DB 연결을 하는 방법으로 두 가지가 있다. 

첫번째는 app.module.ts 에 TypeOrmModule 의 forRoot 메소드를 이용해서 선언하는 방법이다. 

두번째는 DB 연결을 위한 별도 module 을 만들고 이를 app.module.ts 에서 TypeOrmModule 의 forRootAsync 메소드를 통해 이 module 을 불러오는 방법이 있다.

<br>

TypeOrmModule 의 forRoot 메소드가 동기적인 방법으로 DB 연결을 수행한다면 forRootAsync 메소드는 비동기적으로 DB 연결을 수행한다.

forRoot

> The `forRoot()` method supports all the configuration properties exposed by the `DataSource` constructor from the [TypeORM](https://typeorm.io/data-source-options#common-data-source-options) package. In addition, there are several extra configuration properties described below.

<br>

forRootAsync

> You may want to pass your repository module options asynchronously instead of statically. In this case, use the `forRootAsync()` method, which provides several ways to deal with async configuration.

<br>

forRootAsync 는 모듈을 불러오는 방식이라 비동기적으로 동작한다. 프레임워크는 컴파일때 사용자가 선언한 모듈들이 무엇이고 이 모듈들의 의존성을 파악할 수 없다. 런타임때 모듈의 종류와 모듈간의 의존성을 파악할 수 있어서 비동기적으로 동작한다.

[NestJS 가 의존성을 주입하는 내부 동작 방식](https://velog.io/@coalery/nest-injection-how)은 아직 제대로 파악하지 못해서 추가 학습이 필요하다.

<br>

```typescript
// nestjs 의 typeorm 패키지
// lib/typeorm.module.ts
@Module({})
export class TypeOrmModule {
  static forRoot(options?: TypeOrmModuleOptions): DynamicModule {
    return {
      module: TypeOrmModule,
      imports: [TypeOrmCoreModule.forRoot(options)],
    };
  }

  static forRootAsync(options: TypeOrmModuleAsyncOptions): DynamicModule {
    return {
      module: TypeOrmModule,
      imports: [TypeOrmCoreModule.forRootAsync(options)],
    };
  }
}
```

forRootAsync 메소드는 TypeOrmModule 에 선언된 정적 메소드인데 DynamicModule 타입의 객체를 리턴한다(참고로 TypeOrmModule 은 nestjs 의 nest 패키지가 아니라 nestjs 의 typeorm 패키지에 존재한다).

imports 키는 값으로 TypeOrmCoreModule 의 forRootAsync 의 결과물을 배열로 감싸고 있다. forRootAsync 는 내부 동작에서 useFactory 키를 포함하는데 useFactory 키의 값은 비동기 연산이 포함된다. 따라서 forRootAsync 메소드는 기본적으로 비동기로 동작할 수 밖에 없다.

<br>

```typescript
// nestjs 의 typeorm 패키지
// lib/typeorm-core.module.ts
@Global()
@Module({})
export class TypeOrmCoreModule implements OnApplicationShutdown {
  private readonly logger = new Logger('TypeOrmModule');

  constructor(
    @Inject(TYPEORM_MODULE_OPTIONS)
    private readonly options: TypeOrmModuleOptions,
    private readonly moduleRef: ModuleRef,
  ) {}

  static forRootAsync(options: TypeOrmModuleAsyncOptions): DynamicModule {
    // 생략
    const asyncProviders = this.createAsyncProviders(options);
    const providers = [
      ...asyncProviders,
      entityManagerProvider,
      dataSourceProvider,
      {
        provide: TYPEORM_MODULE_ID,
        useValue: generateString(),
      },
      ...(options.extraProviders || []),
    ];
    // 생략

    return {
      module: TypeOrmCoreModule,
      imports: options.imports,
      providers,
      exports,
    };
  }

  // options 의 키에 관계없이 모두 createAsyncOptionsProvider 메소드를 호출한다
  private static createAsyncProviders(
    options: TypeOrmModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<TypeOrmOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  // options 의 옵션에 관계없이 useFactory 키를 포함하게 된다
  // useFactory 의 반환값은 Promise 라 비동기로 동작한다.
  // (useFactory 반환값은 아래의 TypeOrmModuleAsyncOptions 관련 코드 블록 참고)
  private static createAsyncOptionsProvider(
    options: TypeOrmModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: TYPEORM_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    // `as Type<TypeOrmOptionsFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (options.useClass || options.useExisting) as Type<TypeOrmOptionsFactory>,
    ];
    return {
      provide: TYPEORM_MODULE_OPTIONS,
      useFactory: async (optionsFactory: TypeOrmOptionsFactory) =>
        await optionsFactory.createTypeOrmOptions(options.name),
      inject,
    };
  }
}

```

<br>

```typescript
// nestjs 의 typeorm 패키지
// lib/interfaces/typeorm-options.interface.ts
export interface TypeOrmModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<TypeOrmOptionsFactory>;
  useClass?: Type<TypeOrmOptionsFactory>;
  // useFactory 는 Promise 타입을 반환한다
  useFactory?: (
    ...args: any[]
  ) => Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions;
  dataSourceFactory?: TypeOrmDataSourceFactory;
  inject?: any[];
  extraProviders?: Provider[];
}

```

<br>

### no offset

pagination-1 에서는 offset 과 limit 을 활용해서 paging 을 처리했다면 이번에는 offset 없이 limit 과 PK 를 이용해서 paging 을 처리했다. 

offset 의 경우 offset 의 크기 만큼 데이터를 추가적으로 읽어야 해서 이를 보다 빠르게 처리하기 위해 offset 을 사용하지 않는 방식을 사용했다. PK 의 경우 클러스터 인덱스가 돼서 PK 순서대로 데이터 페이지 자체가 정렬된다. 그래서 인덱스를 조회해서 대상 PK 를 빠르게 찾을 수 있다.

paging 응답을 할때 다음으로 조회할 idx 번호를 알려준다. 추후 요청을 받으면 이 idx 보다 작거나 같은 idx 를 기준으로 조회한다.

<br>

<참고>

https://jojoldu.tistory.com/579

https://jojoldu.tistory.com/528

https://docs.nestjs.com/techniques/database

https://docs.nestjs.com/techniques/database#async-configuration

https://velog.io/@coalery/nest-injection-how