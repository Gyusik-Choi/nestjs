# QueryBuilder - where - unique parameter

> When using the `QueryBuilder`, you need to provide unique parameters in your `WHERE` expressions. **This will not work**:

<br>

QueryBuilder 로 where 조건을 작성할때 parameter 값을 중복으로 하면 안 된다. 이는 TypeORM 공식문서의 Select using Query Builder 챕터에서 거의 가장 먼저 언급하는 부분인데 제대로 확인하지 못해서 몇 시간을 삽질했다.

```typescript
const result = await this.myRepository
	.createQueryBuilder("m")
	.where("m.idx = :idx", { idx: 0 })
	.orWhere("m.idx = :idx", { idx: 1 });
```

<br>

이렇게 했을 경우 로깅을 확인해보면 PARAMETER: [ 1, 1 ] 로 나타날 것이다. 

:idx 가 2개가 사용되고 있고, 이 idx 값은 뒤에 작성한 값으로 덮여서 실제 쿼리가 동작할때는 둘 다 1이 되므로 원하는 값을 조회할 수 없다.

<br>

<참고>

https://typeorm.io/select-query-builder#important-note-when-using-the-querybuilder