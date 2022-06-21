# NestJS 프로젝트

## express-session

### 개요

회원가입, 로그인 기능 및 쿠키, 세션을 활용한 사용자 인증 기능을 담은 프로젝트

<br>

### 구조

```
main
app
-- auth
|--- controller
|--- service
---- common
|----- guard (controller 에 접근하기 전에 세션 검증)
---- dto
-- config (express-session 관련 db 설정)
-- entities (db 테이블 및 컬럼과 매칭되는 객체들)
ormconfig (mysql db 설정)
```

<br>

### 기능

회원가입

로그인

사용자 인증

- express-session 으로 로그인시 생성하는 session 정보를 DB 에 저장하고 사용자에게 sessionID 를 부여한다. 이후 사용자가 사용자 인증이 먼저 필요한 서비스에 접근하면 서버는 이에 대한 데이터를 제공하기 이전에 사용자가 request 객체에 담아서 보내는 sessionID 를 DB에 저장된 session 정보와 비교한다.

<br>

### 개발 중 에러

```
field 'id' doesn't have a default value
```

DB 테이블의 id 컬럼을 auto_increment로 하고, Entity도 id 컬럼을 PrimaryGeneratedColumn으로 설정을 했으나 위의 에러가 발생했다. 구글링으로 잘 해결이 안되던 와중에 jpa 쪽에서도 이와 비슷한 에러가 발생했음을 알게됐다. 

[이글](https://hak0205.tistory.com/63)을 보고서 에러를 해결할 수 있었다. 첫 에러가 발생하고 제대로 해결을 못 하고 해당 프로젝트의 코드를 못 보다가 몇일 뒤에 해결할 수 있었다. 당시에는 dbeaver로 id 컬럼의 속성을 보면서 auto_increment가 정상적으로 설정되어 있음을 확인했는데, 다시 살펴보니 auto_increment가 설정되어 있지 않았다. auto_increment를 설정해주니 에러가 해결됐다.

<br>

```
Error: Cannot set headers after they are sent to the client
```

```
Error: ER_ACCESS_DENIED_ERROR: Access denied for user 'user'@'localhost' (using password: YES)
```

위의 두 에러를 해결하는데 오래 걸렸다. 결국 원인은 .env 에 작성한 내용을 제대로 불러오지 못한 문제였다. .env에 작성한 내용을 불러와서 사용하지 않고 직접 입력을 하니 문제가 사라졌다.

.env와 관련해서 파악한 문제는 key, value 형태로 .env 파일을 작성하게 되는데 value를 ' ' 를 써서 작성했다. 예를 들어 벨류 라고 적어야 하는데, '벨류'라고 적었다. 또한 오타로 인해 제대로 불러오지 못하는 문제도 있었다.

<br>

<참고>

https://hak0205.tistory.com/63
