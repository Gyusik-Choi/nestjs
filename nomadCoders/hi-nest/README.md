# NestJS

## 노마드코더 강의

### NestJS로 API 만들기

<br>

### 개요

노마드코더에서 진행한 NestJS 무료 강의를 수강하면서 작성한 코드다.

<br>

### 정리

- NestJS
  - Express와는 달리 프로젝트의 전체적인 구조를 NestJS에서 잡아주며 이 구조에 맞춰서 코드를 작성해야 한다
  - 객체지향적인 코드에 대한 관심이 늘면서 좋은 서버 구조란 무엇일까에 대한 궁금증이 커져가면서 NestJS를 알게 되었다
    - 기본적으로 module, service, controller의 구조를 한 모듈(module) 단위로 갖는다
    - 자연스럽게 모듈 단위로 코드를 분리하고, 모듈 안에서도 기능에 따라 코드를 나눌 수 있다
- 테스트 코드
  - 테스트 코드에 대한 내용들을 접하게 되면서 테스트 코드는 어떻게 작성해야 하는지 알고 싶었는데, 이번 강의를 통해 경험해볼 수 있었다
    - console.log 로 터미널에 찍어보거나, Postman으로 API 요청을 넣는 방법이 아닌 테스트 툴을 이용한 테스트 코드 작성 및 테스트 커버리지, 테스트 성공률 등을 확인해볼 수 있었다
  - 유닛 테스트
    - jest
  - end-to-end 테스트 (e2e)
    - supertest
    - cypress 도 추후에 사용해보고 싶다

<br>

### 개선해야할 부분

- Dependency Injection(DI)(의존성 주입)
  - 한 클래스 안에서 의존성을 갖는 다른 클래스의 인스턴스를 직접 생성하지 않고, 생성자를 통해 주입하는 방식을 이 강의해서 활용했다
  - 의존성 주입에 대해 학습을 하고 있지만 아직 제대로 이해하지 못했다
  - 제대로 이해하고 싶고, 의존성 주입을 어떻게 코드로 구현해야 하는지 제대로 터득하고 싶다

<br>

강의

https://nomadcoders.co/nestjs-fundamentals

참고

https://docs.nestjs.com/

https://medium.com/daangn/typescript%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%9C-%EC%84%9C%EB%B9%84%EC%8A%A4%EA%B0%9C%EB%B0%9C-73877a741dbc

https://medium.com/geekculture/nest-js-architectural-pattern-controllers-providers-and-modules-406d9b192a3a

https://tecoble.techcourse.co.kr/post/2021-04-27-dependency-injection/

