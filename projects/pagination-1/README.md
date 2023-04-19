# Pagination

pagination 을 구현 해보면서 pagination 뿐만 아니라 DB 학습도 할 수 있는 기회라고 생각했다. 

특히 기본적인 인덱스, 커버링 인덱스, 클러스터 인덱스, 실행 계획 등에 대한 이해를 높이기 위해 이번 프로젝트를 시작했다.

<br>

### 에러

#### Error: Cannot find module '../../src/entities/board.entity'

```typescript
import { Board } from '../../src/entities/board.entity';
```

<br>

위처럼 상대 경로가 아닌 아래처럼 절대 경로로 작성해야 한다.

```typescript
import { Board } from 'src/entities/board.entity';
```

<br>

그러나 절대 경로로 작성시 테스트 코드에서 에러가 발생할 수 있다.

상대 경로로 바꾸기 위해서 dist 에 없는 src 를 경로에서 제외할 수 있다.

```typescript
import { Board } from "../entities/board.entity";
```

<br>

서버를 실행하면 dist 에 들어있는 js 파일이 실행되는데 상대 경로로 설정하면 src 가 js 파일에 남아있게 되는데 dist 에는 src 폴더가 없기 때문에 entity 를 찾지 못하여 에러가 발생한다.

상대 경로로 설정했을 경우 js 파일의 board.entity 에 대한 경로

```js
const board_entity_1 = require("../../src/entities/board.entity");
```

<br>

절대 경로로 설정했을 경우 js 파일의 board.entity 에 대한 경로

```javascript
const board_entity_1 = require("../entities/board.entity");
```

<br>

### @Param vs @Query

@Param 과 @Query 에 대한 차이를 제대로 알지 못했다.

@Param 은 path paramter 에 대한 값을 받을 떄 사용한다. 

@Query 는 query paramter 에 대한 값을 받을 때 사용한다.

<br>

@Param

```
http://localhost:3000/board/search/:id
```

위처럼 가변적인 id 값을 받을 때 @Param 을 사용할 수 있다.

<br>

@Query

```
http://localhost:3000/board/search?pageNumber=1&pageSize=10
```

위처럼 pageNumber 와 pageSize 값에 접근하고 싶을 때 @Query 를 사용할 수 있다.

<br>

### getManyAndCount

> Executes built SQL query and returns entities and overall entities count (without limitation).
>
> This method is useful to build pagination.

getManyAndCount 는 조건에 맞는 데이터를 조회할 뿐만 아니라 전체 데이터 갯수를 반환한다. 이때 limit 이나 offset 을 걸어서 나온 최종 데이터 갯수가 아니라 select 했을 때 나오는 전체 데이터 갯수다. 

paging 함수를 작성하면서 문득 해당 테이블의 전체 데이터 갯수를 왜 반환해줘야 할까 의문이 들었다. paging 함수를 클라이언트에서 호출한다는 것 자체가 paging 방식으로 데이터를 보여주고 있기 때문에 페이지 번호를 나열해야 한다. 페이지 번호를 나열하려면 전체 데이터 갯수가 있어야 가능하다. 사실 너무 당연한 내용인데 간과하고 있었다.

<br>

paging 함수에서 

count 는 count(*) 를 통해서 해당 테이블의 전체 row 수를 반환한다.

<br>

### DTO 에 default 값 설정

BoardService 의 search 메소드에 대한 unit test 를 수행할때 BoardSearchRequestDTO 가 필요한데 BoardSearchRequestDTO 의 필드들은 private 으로 선언되어 있다. 해당 DTO 는 생성자로 private 필드값을 주입할 수 없어서 필드들의 값을 실제 호출할 때가 아니면 설정하기가 까다롭다.

default 값이 따로 없으면 private 필드들의 값이 제대로 설정되지 않아서 원하는 값을 얻기 어려운데 default 값을 설정할 수 있는 방법이 존재했다. 아래와 같이 변수에 값을 할당해주면 해당 값이 default 값이 된다. 실제 호출시 해당 DTO 의 value 값을 설정해주면 설정한 값으로 덮이고 설정하지 않으면 default 값으로 설정된다.

```typescript
export class FooDTO {
	@IsNumber()
  	private value: number = 1;
}

```



<br>

### custom repository

(추가 예정)

<br>

<참고>

https://ganzicoder.tistory.com/156

https://jojoldu.tistory.com/579

https://jojoldu.tistory.com/243

https://jojoldu.tistory.com/476

https://jojoldu.tistory.com/528

https://jojoldu.tistory.com/529

https://hoing.io/archives/5960

https://wonyong-jang.github.io/database/2020/09/06/DB-Pagination.html

https://pangtrue.tistory.com/286

https://ryan-han.com/post/translated/pathvariable_queryparam/

https://gist.github.com/anchan828/9e569f076e7bc18daf21c652f7c3d012

https://stackoverflow.com/questions/71557301/how-to-workraound-this-typeorm-error-entityrepository-is-deprecated-use-repo

https://velog.io/@from_numpy/Nest-Custom-Repository-%EC%83%9D%EC%84%B1%EB%B6%80%ED%84%B0-%EC%A0%81%EC%9A%A9%EA%B9%8C%EC%A7%80-feat.-%ED%9A%8C%EC%9B%90%EA%B0%80%EC%9E%85-%EC%9D%B8%EC%A6%9D

https://velog.io/@pk3669/typeorm-0.3.x-EntityRepository-%EB%8F%8C%EB%A0%A4%EC%A4%98

https://stackoverflow.com/questions/58057916/what-does-t-extends-new-args-any-constructort-mean-in-typescr

https://stackoverflow.com/questions/73080334/how-to-set-default-values-on-dto-nestjs

