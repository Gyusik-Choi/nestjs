# custom repository를 exports 에 추가하는 방법

일반 repository와 custom repository는 imports와 exports에 작성할때 방법이 다르므로 주의해야 한다.

<br>

일반 repository

Cat (entity)

imports에서 entity 클래스 명을 기재한다. CatsService에 의존성 주입으로 Repository< Cat >을 주입해준다면 exports에는 CatsService만 기재하면 된다.

```tsx
@Module({
  imports: [
    TypeOrmModule.forFeature([Cat]),
  ],
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
```

<br>

custom repository

Cat (entity) + CatsRepository (extends Repository< Cat >)(repository)

imports에서 entity 클래스 명이 아니라 custom repository 클래스 명을 기재하고, exports 에는 custom repository 클래스 명이 아니라 TypeOrmModule.forFeature() 를 기재한다.

```tsx
@Module({
  imports: [
    TypeOrmModule.forFeature([CatsRepository]),
  ],
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService, TypeOrmModule.forFeature()],
})
```





<참고>

https://github.com/nestjs/nest/issues/5526

https://github.com/nestjs/typeorm/issues/317

https://docs.nestjs.com/techniques/database

https://typeorm.io/#/custom-repository