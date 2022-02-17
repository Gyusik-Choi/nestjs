# NestJS - 특정 모듈에 Controller, Service 파일 생성

NestJS CLI 환경에서 새로운 프로젝트를 만들고, Module을 만드는 것은 잘 수행했으나 새로 만든 Module 안에 Controller와 Service 파일을 만드려고 하니 어떻게 해야할지 몰랐다.

<br>

NestJS CLI를 전역으로 설치하고서 터미널에 nest를 입력하면 generate 명령어 뒤에 입력해서 생성할 수 있는 것들을 확인할 수 있다.

          ┌───────────────┬─────────────┬──────────────────────────────────────────────┐
          │ name          │ alias       │ description                                  │
          │ application   │ application │ Generate a new application workspace         │
          │ class         │ cl          │ Generate a new class                         │
          │ configuration │ config      │ Generate a CLI configuration file            │
          │ controller    │ co          │ Generate a controller declaration            │
          │ decorator     │ d           │ Generate a custom decorator                  │
          │ filter        │ f           │ Generate a filter declaration                │
          │ gateway       │ ga          │ Generate a gateway declaration               │
          │ guard         │ gu          │ Generate a guard declaration                 │
          │ interceptor   │ in          │ Generate an interceptor declaration          │
          │ interface     │ interface   │ Generate an interface                        │
          │ middleware    │ mi          │ Generate a middleware declaration            │
          │ module        │ mo          │ Generate a module declaration                │
          │ pipe          │ pi          │ Generate a pipe declaration                  │
          │ provider      │ pr          │ Generate a provider declaration              │
          │ resolver      │ r           │ Generate a GraphQL resolver declaration      │
          │ service       │ s           │ Generate a service declaration               │
          │ library       │ lib         │ Generate a new library within a monorepo     │
          │ sub-app       │ app         │ Generate a new application within a monorepo │
          │ resource      │ res         │ Generate a new CRUD resource                 │
          └───────────────┴─────────────┴──────────────────────────────────────────────┘

<br>

Controller와 Service 파일 자체는 생성하는 법을 터미널로 확인을 할 수 있는데 원하는 모듈 아래에는 어떻게 설치해야 할지 몰랐다.

```bash
nest g co [여기서부터 뭐라고 해야할지 몰랐음]
```

```bash
nest g s [여기서부터 뭐라고 해야할지 몰랐음]
```

<br>

구글링을 통해 간단하게 확인할 수 있었다. 모듈 이름을 기재하면 된다.

users 모듈 아래에 Controller와 Service 파일을 생성하려면 아래와 같이 입력하면 된다.

```bash
nest g co users
```

```
nest g s users
```



<br>

참고

https://stackoverflow.com/questions/60461314/how-to-specify-which-module-to-add-controller-to-in-nestjs-cli