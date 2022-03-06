# schedule

이번 실습을 통해서 NestJS의 schedule 기능을 사용해보고자 한다.

NestJS 에서 제공해주는 schedule 패키지를 이용해서 특정한 시간에 원하는 동작을 수행하도록 스케줄을 설정할 수 있다.

schedule 패키지는 node-cron 과 통합하여 기능을 제공해주고 있다.

<br>

NestJS + TypeORM + MYSQL 환경에서 실습을 진행한다.

모듈은 총 3개로 구성된다. 루트 모듈인 AppModule과 AuthModule, TasksModule 이다.

AuthModule 에는 MYSQL의 UserAccount 테이블에서 유저 정보를 조회해오는 getAllUsers 함수가 있다. 이를 매일 1시 30분에 스케줄을 수행하도록 설정하려고 한다.

TasksModule에 AuthModule에서 exports한 AuthService를 이용하기 위해 AuthModule을 imports에 작성해준다. 그리고 TasksService에 의존성 주입을 통해 AuthService를 주입해준다.

TasksService에서 시간 설정(시간 설정은 cron pattern에 따라서 작성하면 된다)을 하고 AuthService의 getAllUsers 메소드를 호출하면 완료다.

<br>

<참고>

https://docs.nestjs.com/techniques/task-scheduling

https://crontab.guru/



