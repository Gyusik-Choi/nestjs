# mssql & querybuilder - random select

mssql 에서 random 으로 select 한 개를 하는 쿼리는 다음과 같다.

```sql
select top(1) * from A order by NewID();
```

<br>

이를 typeorm 에서는 querybuilder 로 구현할 수 있다.

```typescript
await this.aRepository.createQueryBuilder()
  .orderBy("NewID()")
  .getOne();
```

<br>

<참고>

https://www.youtube.com/watch?v=cgQrSdOrcSo