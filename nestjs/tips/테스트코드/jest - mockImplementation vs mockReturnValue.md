# mockImplementation vs mockReturnValue

createQueryBuilder 관련 테스트를 진행 하면서 발견한 mockImplementation 과 mockReturnValue 의 차이를 정리하고자 한다.

<br>

### service

테스트 대상인 service 함수 예시 코드는 아래와 같다. repository 에서 createQueryBuilder 로 query builder 를 생성하고 where, andWhere, orderBy 등의 조건을 거쳐서 최종적으로 getOne 을 통해 조건에 맞는 하나의 아이템만 반환한다.

```typescript
// service
async getSomething(): [Error, null] | [null, SomeEntity] {
  try {
    const result: SomeEntity = await this.someRepository.createQueryBuilder("some")
      .where("")
      .andWhere("")
      .orderBy("")
      .getOne();
    return [null, result];
  } catch (err) {
    return [err, null];
  }
}
```

<br>

### test

테스트에서 mock repository 가 리턴하는 값을 개별 테스트마다 다르게 하기 위해서 it 구문 안에서 repository 의 mockResolvedValue 를 새로 정의했다.

<br>

### mockImplementation

service 코드에서 사용하는 createQueryBuilder, where, andWhere, orderBy, getOne 등을 모두 재정의했다.

테스트 바깥에서 mock repository 를 선언했는데, getOne 의 리턴 값은 정의하지 않고 it 구문 안에서 정의한다.

이때 it 구문 안에서 getOne 만 mockResolvedValue 로 원하는 값을 세팅하는게 아니라 createQueryBuilder 부터 다시 재정의했다.

(추후 따로 언급하겠지만 이 경우에 it 구문 안에서 getOne 만 mockResolvedValue 로 선언할 경우 테스트를 통과하지 못한다.)

```typescript
// service.spec.ts
const mockSomeRepository = () => ({
  createQueryBuilder: jest.fn().mockImplementation(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  })),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('SomeService', () => {
  let service: SomeService;
  let someRepository: MockRepository<SomeEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SomeService,
        {
          provide: getRepositoryToken(SomeEntity),
          useValue: mockSomeRepository(),
        }
      ],
    }).compile();

    service = module.get<SomeService>(SomeService);
    someRepository = module.get<MockRepository<SomeEntity>>(
      getRepositoryToken(SomeEntity),
    );
  });

  describe('getSomething', () => {
    it('getSomething success', async () => {
      const item = {'a': 1};

      someRepository.createQueryBuilder.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(item),
      }));

      const result = await service.getSomething();
      expect(result[1]).toEqual(item);
    })
  });
});
```

<br>

위와 다르게 테스트 바깥에 선언한 mockSomeRepository 를 createQueryBuilder 까지만 jest.fn() 으로 정의했다.

```typescript
// service.spec.ts
const mockSomeRepository = () => ({
  createQueryBuilder: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('SomeService', () => {
  let service: SomeService;
  let someRepository: MockRepository<SomeEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SomeService,
        {
          provide: getRepositoryToken(SomeEntity),
          useValue: mockSomeRepository(),
        }
      ],
    }).compile();

    service = module.get<SomeService>(SomeService);
    someRepository = module.get<MockRepository<SomeEntity>>(
      getRepositoryToken(SomeEntity),
    );
  });

  describe('getSomething', () => {
    it('getSomething success', async () => {
      const item = {'a': 1};

      someRepository.createQueryBuilder.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(item),
      }));

      const result = await service.getSomething();
      expect(result[1]).toEqual(item);
    })
  });
});

```

<br>

### mockReturnValue

mockImplementation 이 아닌 mockReturnValue 로 테스트 바깥에 mock repository 를 선언했다.

이 경우에는 it 구문에서 getOne 을 감싸는 createQueryBuilder 부터 재정의할 필요 없이 getOne 부분만 mockResolvedValue 로 정의 하더라도 테스트를 통과한다.

```typescript
// service.spec.ts
const mockSomeRepository = () => ({
  createQueryBuilder: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  })),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('SomeService', () => {
  let service: SomeService;
  let someRepository: MockRepository<SomeEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SomeService,
        {
          provide: getRepositoryToken(SomeEntity),
          useValue: mockSomeRepository(),
        }
      ],
    }).compile();

    service = module.get<SomeService>(SomeService);
    someRepository = module.get<MockRepository<SomeEntity>>(
      getRepositoryToken(SomeEntity),
    );
  });

  describe('getSomething', () => {
    it('getSomething success', async () => {
      const item = {'a': 1};

      someRepository.createQueryBuilder().getOne.mockResolvedValue(item);

      const result = await service.getSomething();
      expect(result[1]).toEqual(item);
    })
  });
});
```

<br>

### 테스트 실패

아래의 테스트는 통과하지 못한다.

아래처럼 테스트 바깥에 mockImplementation 으로 mock repository 의 createQueryBuilder 를 선언한 경우 it 구문 안에서 getOne 에 대해서만 mockResolvedValue 를 선언하면 원하는 값이 나오지 않는다.

item 이 나오길 expect 했지만 실제 나오는 값은 undefined 다.

```typescript
// service.spec.ts
const mockSomeRepository = () => ({
  createQueryBuilder: jest.fn().mockImplementation(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  })),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('SomeService', () => {
  let service: SomeService;
  let someRepository: MockRepository<SomeEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SomeService,
        {
          provide: getRepositoryToken(SomeEntity),
          useValue: mockSomeRepository(),
        }
      ],
    }).compile();

    service = module.get<SomeService>(SomeService);
    someRepository = module.get<MockRepository<SomeEntity>>(
      getRepositoryToken(SomeEntity),
    );
  });

  describe('getSomething', () => {
    it('getSomething success', async () => {
      const item = {'a': 1};

      someRepository.createQueryBuilder().getOne.mockResolvedValue(item);

      const result = await service.getSomething();
      // item 이 아닌 undefined 가 나온다
      expect(result[1]).toEqual(item);
    })
  });
});
```

<br>

mockImplementation 과 mockReturnValue 가 왜 이러한 차이가 발생하는지에 대해서는 아직 이해하지 못했다.

<br>

<참고>

https://jestjs.io/docs/mock-functions

https://jestjs.io/docs/mock-function-api#mockfnmockimplementationfn

https://medium.com/@rickhanlonii/understanding-jest-mocks-f0046c68e53c

https://velog.io/@hkja0111/NestJS-11-Unit-Test-QueryBuilder

