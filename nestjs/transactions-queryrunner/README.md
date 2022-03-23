# NestJS Transactions
## QueryRunner

NestJS + TypeORM + MYSQL 조합에서 트랜잭션을 실습해보려고 한다.

<br>

TypeORM이 2022년 3월 17일을 기점으로 큰 변화가 있었다. 

버전이 0.3.0(아직 정식 버전이 아니며 2022년 3월 23일 기준으로 최신 버전은 0.3.2)으로 업데이트 되면서 기존에 0.2.44 버전에서 활용하던 connection 방식이 바뀌었다. 

Connection 클래스가 DataSource 클래스로 대체됐다. 기존에 Connection 클래스는 src > connection > Connection에 정의되어 있었는데 아래 0.3.2 버전의 코드를 보면 Connection 클래스는 deprecated 됐다. Connection 클래스는 이름만 남아있는 상태다.

```tsx
import { DataSource } from "../data-source/DataSource";
/**
 * Connection is a single database ORM connection to a specific database.
 * Its not required to be a database connection, depend on database type it can create connection pool.
 * You can have multiple connections to multiple databases in your application.
 *
 * @deprecated
 */
export declare class Connection extends DataSource {
}

```

<br>

DataSource 클래스에서 기존 Connection에서 하던 메소드들도 들고왔다. 대표적으로 Connection 클래스에서 사용하던 createQueryRunner 메소드를 DataSource의 메소드로 사용해야 한다. 그래서 0.3.0 이상의 버전에서 QueryRunner 를 통한 트랜잭션을 NestJS에서 이용하려면 DataSource를 import 해와야 한다.

```tsx
// 0.2.45 이하
// service 파일

import { Connection } from 'typeorm';

@Injectable()
export class AService {
  constructor(
    private readonly connection: Connection,
  ) {}
  
  async a() {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
  }
}
```

<br>

```tsx
// 0.3.0 이상
// service 파일

import { DataSource } from 'typeorm';

@Injectable()
export class AService {
  constructor(
    private readonly dataSource: DataSource,
  ) {}
  
  async a() {
    const queryRunner: DataSource = this.dataSource.createQueryRunner();
  }
}
```

<br>

그러나 문제는 현재 NestJS 버전에서는 이것이 제대로 동작하지 않는다. 이대로 사용을 하면 모듈 의존성 에러가 발생하게 된다. TypeORM의 업데이트가 불과 몇일 전에 됐기 때문에 아직 NestJS에서 이를 완전히 반영하지 못한 것으로 보인다. NestJS에서 이를 해결하기 전에는 당분간 TypeORM은 0.2.45 이하의 버전을 사용하려 한다.

<br>

TypeORM의 자세한 변화는 [이곳](https://github.com/typeorm/typeorm/releases/tag/0.3.0)에서 확인할 수 있다.



<참고>

https://github.com/typeorm/typeorm/releases/tag/0.3.0

