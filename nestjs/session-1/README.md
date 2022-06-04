# NestJS 프로젝트

## express-session

### 개발 중 에러

```
field 'id' doesn't have a default value
```

DB 테이블의 id 컬럼을 auto_increment로 하고, Entity도 id 컬럼을 PrimaryGeneratedColumn으로 설정을 했으나 위의 에러가 발생했다. 구글링으로 잘 해결이 안되던 와중에 jpa 쪽에서도 이와 비슷한 에러가 발생했음을 알게됐다. 

[이글](https://hak0205.tistory.com/63)을 보고서 에러를 해결할 수 있었다. 첫 에러가 발생하고 제대로 해결을 못 하고 해당 프로젝트의 코드를 못 보다가 몇일 뒤에 해결할 수 있었다. 당시에는 dbeaver로 id 컬럼의 속성을 보면서 auto_increment가 정상적으로 설정되어 있음을 확인했는데, 다시 살펴보니 auto_increment가 설정되어 있지 않았다. auto_increment를 설정해주니 에러가 해결됐다.

<br>

<참고>

https://hak0205.tistory.com/63
