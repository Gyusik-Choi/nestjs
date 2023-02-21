# getMany vs getRawMany

> There are two types of results you can get using select query builder: **entities** and **raw results**. Most of the time, you need to select real entities from your database, for example, users. For this purpose, you use `getOne` and `getMany`. However, sometimes you need to select specific data, like the *sum of all user photos*. Such data is not an entity, it's called raw data. To get raw data, you use `getRawOne` and `getRawMany`.

TypeORM 공식문서를 보면 getMany, getRawMany 의 차이점이 나오긴 하는데, 이를 보고 오해한 부분이 있었다. getRawMany 는 sum 등의 함수로 컬럼 값을 가공할 경우에 사용하는 것이라고 생각했다.

그러다 query builder 로 left join 을 하여 getMany 로 select 를 할 경우 원하는 결과물이 나오지 않는다는 회사 동료분의 얘기를 듣게 됐다. 게다가 getRawMany 로는 원하는 결과물이 나오자 둘의 차이가 더욱 궁금해졌다.

<br>

#### 소스코드

0.3.12 버전 기준

<br>

##### getMany

getMany 는 쿼리한 결과물을 entity 로 매핑하여 리턴한다.

getMany 와 연관된 주요 함수는 getRawAndEntities, executeEntitiesAndRawResults 다.

```typescript
// typeorm/src/query-builder/SelectQueryBuilder.ts

async getMany(): Promise<T[]> {}

async getRawAndEntities<T = any>(): Promise<{
  entities: Entity[]
  raw: T[]
}> {}

protected async executeEntitiesAndRawResults(
  queryRunner: QueryRunner,
): Promise<{ entities: Entity[]; raw: any[] }> {}
```

<br>

일부 코드를 조금 더 살펴 보겠다.

```typescript
// typeorm/src/query-builder/SelectQueryBuilder.ts

async getMany<T = any>(): Promise<T[]> {
  if (this.expressionMap.lockMode === "optimistic")
    throw new OptimisticLockCanNotBeUsedError()

  // getRawAndEntities 는 entities 와 raw 를 리턴하고
  const results = await this.getRawAndEntities()
  // getMany 에서는 raw 를 제외하고 entities 만 리턴한다
  return results.entities
}

async getRawAndEntities<T = any>(): Promise<{
  entities: Entity[]
  raw: T[]
}> {
  try {
    ...
    const results = await this.executeEntitiesAndRawResults(queryRunner)
    ...
    return results;
  } catch {
  
  } finally {
    
  }
}
    
protected async executeEntitiesAndRawResults(
  queryRunner: QueryRunner,
): Promise<{ entities: Entity[]; raw: any[] }> {
  let rawResults: any[] = [],
      entities: any[] = []
  
  // 아래 if 조건은 이해하지 못했다
  // 조건문에 따라서 rawResults 를 얻는 방법이 달라진다
  if (
    (this.expressionMap.skip || this.expressionMap.take) &&
     this.expressionMap.joinAttributes.length > 0
  ) {
    // getRawMany 를 호출한다
    rawResults = await new SelectQueryBuilder(
      this.connection,
      queryRunner
    )
      .select()
  	  ...
      .getRawMany();
  } else {
    // loadRawResults 를 호출한다.
    rawResults = await this.loadRawResults(queryRunner)
  }
  
  if (rawResults.length > 0) {
    // RawSqlResultsToEntityTransformer 클래스의
    // transform 함수에서
    // rawResults 를 entity 로 매핑하는 작업을 수행한다
    const transformer = new RawSqlResultsToEntityTransformer(
      this.expressionMap,
      this.connection.driver,
      rawRelationIdResults,
      rawRelationCountResults,
      this.queryRunner,
    )
    entities = transformer.transform(
      rawResults,
      this.expressionMap.mainAlias!,
    )
  }

  // raw 의 값으로 rawResults,
  // entities 의 값으로 entities 를 
  // 설정하여 객체 형태로 리턴
  return {
    raw: rawResults,
    entities: entities,
  }
}
```

<br>

##### getRawMany

getRawMany 의 주요 함수는 loadRawResults 이고, getMany 에서도 조건에 따라서 loadRawResults  를 호출하기도 한다.

```typescript
// typeorm/src/query-builder/SelectQueryBuilder.ts

async getRawMany<T = any>(): Promise<T[]> {
  try {
    ...
    const results = await this.loadRawResults(queryRunner)
    ...
    return results;
  } catch {
  
  } finally {
    
  }
}
    
protected async loadRawResults(queryRunner: QueryRunner) {
  const [sql, parameters] = this.getQueryAndParameters()
  ...
  const results = await queryRunner.query(sql, parameters, true)
  ...
  return results.records;
}
```

<br>

#### 리턴 타입

TypeORM 소스코드를 보면 getMany 와 getRawMany 의 리턴 타입이 서로 다르다.

getMany 는 Promise< Entity[] > 를 리턴하고

getRawMany 는 Promise< T[] > 를 리턴한다.

```typescript
async getMany(): Promise<Entity[]> {}
async getRawMany<T = any>(): Promise<T[]> {}
```

<br>

MyService 라는 서비스에서 MyList 엔티티를 YourList 와 left join 을 수행하여 getMany 를 통해 리턴하려고 한다.

```typescript
@Injectable
export class MyService {
  constructor(
    @InjectRepository(MyList)
    private readonly myListRepository: Repository<MyList>,
  ) {}

  async getMyListTest(num: number) {
    try {
      return await this.myListRepository
        .createQueryBuilder('MyList')
        .leftJoinAndSelect(YourList, 'YourList', 'MyList.ListNo = YourList.ListNo')
        .where('MyList.ListNo = :ListNo', { ListNo: num })
        .getMany();
    } catch (err) {
      throw new InternalServerErrorException('잘못된 요청입니다', err);
    }
  }
}
```

getMany 가 나타내는 리턴 타입은 Promise< MyList[] > 다.

left join 으로 어떤 테이블을 하는지와 상관없이 left join 에 활용된 엔티티의 내용은 확인할 수 없다.

<br>

이번에는 getMany 대신 getRawMany 를 사용한다.

```typescript
@Injectable
export class MyService {
  constructor(
   @InjectRepository(MyList)
   private readonly myListRepository: Repository<MyList>,
  ) {}

  async getMyListTest(num: number) {
    try {
      return await this.myListRepository
        .createQueryBuilder('MyList')
        .leftJoinAndSelect(YourList, 'YourList', 'MyList.ListNo = YourList.ListNo')
        .where('MyList.ListNo = :ListNo', { ListNo: num })
        .getRawMany();
    } catch (err) {
      throw new InternalServerErrorException('잘못된 요청입니다', err);
    }
  }
}
```

getRawMany 가 나타내는 리턴 타입은 Promise< any[] > 다.

<br>

#### Select

select 로 MyList 엔티티의 변수를 지정할 수 있다.

```typescript
@Injectable
export class MyService {
  constructor(
    @InjectRepository(MyList)
    private readonly myListRepository: Repository<MyList>,
  ) {}

  async getMyListTest(num: number): Promise<MyList[]> {
    try {
      return await this.myListRepository
        .createQueryBuilder('MyList')
        .leftJoinAndSelect(YourList, 'YourList', 'MyList.ListNo = YourList.ListNo')
        .where('MyList.ListNo = :ListNo', { ListNo: num })
        .select(['MyList.ListID', 'YourList.ListID'])
        .getMany();
    } catch (err) {
      throw new InternalServerErrorException('잘못된 요청입니다', err);
    }
  }
}
```

다만 이때 getMany 는 ListID 외에 select 에 포함하지 않은 MyList 엔티티의 다른 컬럼 값에도 접근이 가능하다.

이때 실제로는 select 에 포함되지 않아서 undefined 가 나온다.

그리고 left join 에 활용한 YourList 엔티티의 컬럼은 결과물에 담기지 않는다.

<br>

MyList 엔티티 클래스는 아래와 같다.

```typescript
@Entity('MyList')
export class MyList {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  ListNo: number;
  
  Column({
    type: 'varchar',
  })
  ListID: string;
  
  Column({
    type: 'varchar',
  })
  ListName: string;
}
```

<br>

YourList 엔티티 클래스는 아래와 같다.

```typescript
@Entity('YourList')
export class YourList {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  ListNo: number;
  
  Column({
    type: 'varchar',
  })
  ListID: string;
  
  Column({
    type: 'varchar',
  })
  ListName: string;
}
```

<br>

MyService 에서 test 함수를 수행한다.

test 함수에서는 getMany 로 쿼리 결과를 리턴한다.

```typescript
@Injectable
export class MyService {
  constructor(
    @InjectRepository(MyList)
    private readonly myListRepository: Repository<MyList>,
  ) {}

  async test() {
    const result: MyList[] = await this.getMyListTest(1);
    
    // 출력 결과는 아래와 같다
    // [MyList {ListID: 1}]
    //
    // 이 결과를 받게되는 터미널 등의 클라이언트는
    // MyList 엔티티를 알지 못하기 때문에
    // [{ListID: 1}]
    console.log(result);
    
    // select 에 포함되지 않은 ListName 에 접근
    // undefined 가 출력된다
    console.log(result[0].ListName)
  }

  async getMyListTest(num: number) {
    try {
      return await this.myListRepository
        .createQueryBuilder('MyList')
        .leftJoinAndSelect(YourList, 'YourList', 'MyList.ListNo = YourList.ListNo')
        .where('MyList.ListNo = :ListNo', { ListNo: num })
        .select(['MyList.ListID'])
        .getMany();
    } catch (err) {
      throw new InternalServerErrorException('잘못된 요청입니다', err);
    }
  }
}
```

test 함수에서 getMyListTest 함수를 호출한 결과물에 접근하는데 이때 IDE 는 result[0]. 까지 입력하면 MyList 에 관련된 모든 컬럼들을 자동 완성 후보로 보여준다.

타입스크립트는 result[0] 에 select 한 ListID 만 있는 것을 알지 못하고 MyList 엔티티의 모든 컬럼들에 접근하려고 한다. result[0].ListName 의 출력을 시도하면 undefined 가 나온다.

<br>

MyService 에서 test 함수를 수행하는데 이번에는 getRawMany 로 쿼리 결과를 리턴한다.

getRawMany 는 배열 안에 객체 형태로 결과값이 담긴다.

```typescript
@Injectable
export class MyService {
  constructor(
    @InjectRepository(MyList)
    private readonly myListRepository: Repository<MyList>,
  ) {}

  async test() {
    const result: any[] = await this.getMyListTest(1);
    // 결과물의 타입이 엔티티가 아니라서
    // 출력과 클라이언트는 모두 같은 결과물을 받게 된다
    // [{ListID: 1}]
    console.log(result);
    // result 에 대해 IDE 는 정확한 자동 완성을 할 수 없다
    // getMany 는 select 하지 않은 컬럼도 자동 완성으로 보여준다면
    // getRawMany 는 결과물이 무엇인지 실행하기 전까지 알 수가 없어서 IDE 는 정확한 자동 완성을 할 수 없다
    console.log(result[0].???)
  }

  async getMyListTest(num: number): Promise<any> {
    try {
      return await this.myListRepository
        .createQueryBuilder('MyList')
        .leftJoinAndSelect(YourList, 'YourList', 'MyList.ListNo = YourList.ListNo')
        .where('MyList.ListNo = :ListNo', { ListNo: num })
        .select(['MyList.ListID'])
        .getRawMany();
    } catch (err) {
      throw new InternalServerErrorException('잘못된 요청입니다', err);
    }
  }
}
```

<br>

위와 달리 아래는 select 없이 getRawMany 를 수행한다.

```typescript
@Injectable
export class MyService {
  constructor(
    @InjectRepository(MyList)
    private readonly myListRepository: Repository<MyList>,
  ) {}

  async test() {
    const result: any[] = await this.getMyListTest(1);
    // YourList 엔티티의 컬럼은 모두 null 로 나옴에 주의
    //
    // [
    //  {
    //    MyList_ListNo: 1,
    //    MyList_ListID: 'my id',
    //    MyList_ListName: 'my name',
    //    YourList_ListNo: null,
    //    YourList_ListID: null,
    //    YourList_ListName: null,
  	//  }
    // ]
    console.log(result);
  }

  async getMyListTest(num: number): Promise<any> {
    try {
      return await this.myListRepository
        .createQueryBuilder('MyList')
        .leftJoinAndSelect(YourList, 'YourList', 'MyList.ListNo = YourList.ListNo')
        .where('MyList.ListNo = :ListNo', { ListNo: num })
        .getRawMany();
    } catch (err) {
      throw new InternalServerErrorException('잘못된 요청입니다', err);
    }
  }
}
```

select 를 따로 하지 않으면 MyList, YourList 컬럼 값들이 모두 나오는데 다만 YourList 컬럼은 null 로 나온다.

<br>

#### alias

getMany 에서 alias 는 적용할 수 없다.

```typescript
@Injectable
export class MyService {
  constructor(
    @InjectRepository(MyList)
    private readonly myListRepository: Repository<MyList>,
  ) {}

  async test() {
    const result: MyList[] = await this.getMyListTest(1);
    // 빈 배열이 출력된다
	// []
    console.log(result)
  }

  async getMyListTest(num: number) {
    try {
      return await this.myListRepository
        .createQueryBuilder('MyList')
        .leftJoinAndSelect(YourList, 'YourList', 'MyList.ListNo = YourList.ListNo')
        .where('MyList.ListNo = :ListNo', { ListNo: num })
        .select(['MyList.ListID AS listID'])
        .getMany();
    } catch (err) {
      throw new InternalServerErrorException('잘못된 요청입니다', err);
    }
  }
}
```

<br>

getRawMany 는 alias 로 설정한 값으로 나온다.

```typescript
@Injectable
export class MyService {
  constructor(
    @InjectRepository(MyList)
    private readonly myListRepository: Repository<MyList>,
  ) {}

  async test() {
    const result: MyList[] = await this.getMyListTest(1);
    // alias 로 설정한 listID 가 나온다
    // [{listID: 1}]
    console.log(result)
  }

  async getMyListTest(num: number) {
    try {
      return await this.myListRepository
        .createQueryBuilder('MyList')
        .leftJoinAndSelect(YourList, 'YourList', 'MyList.ListNo = YourList.ListNo')
        .where('MyList.ListNo = :ListNo', { ListNo: num })
        .select(['MyList.ListID AS listID'])
        .getRawMany();
    } catch (err) {
      throw new InternalServerErrorException('잘못된 요청입니다', err);
    }
  }
}
```

<br>

#### 정리

getMany 는 특정 컬럼을 select 하는게 아니라 엔티티 클래스 전체의 결과물을 얻을 때 사용하면 적절할 것 같다. 물론 특정 컬럼만 select 할 때도 가능하지만 이때는 select 하지 않은 컬럼에 접근하지 않도록 주의해야 한다.

특정 컬럼을 제외하고 싶다면 class-validator 등을 이용해서 별도의 클래스 인스턴스로 변환해주는 작업을 수행할 수도 있다. ~~저도 이에 대한 추가 학습이 필요합니다~~.

getRawMany 는 특정 컬럼만 select 할 때 사용하면 적절할 것 같다. join 하는 엔티티의 컬럼도 select 할 수 있고 alias 지정도 가능하다. 다만 엔티티 클래스 전체를 활용할 때는 select 를 하지 않으면 join 에 사용된 엔티티의 값은 null 로 나옴에 주의해야 한다.

<br>

####  참고

https://typeorm.io/select-query-builder#getting-raw-results

https://seungtaek-overflow.tistory.com/19

https://github.com/typeorm/typeorm/blob/74f7f796aa1d5d241687197f504d2786bee271e1/src/query-builder/SelectQueryBuilder.ts#L1747

https://jojoldu.tistory.com/610