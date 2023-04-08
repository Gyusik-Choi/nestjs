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
