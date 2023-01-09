# string -> number

nestjs 환경에서 class-transformer, class-validator 를 이용하여 string 으로 들어오는 number 를 number type 으로 변환하고 싶었다.

<br>

```typescript
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateCatDTO } from './dto/create-cat.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createCat(
    @Body(new ValidationPipe({ transform: true })) cat: CreateCatDTO,
    // @Body() cat: CreateCatDTO,
  ) {
    console.log(cat);
  }
}

```

<br>

```typescript
import { Transform } from "class-transformer";
import { IsInt, IsString } from "class-validator";

export class CreateCatDTO {
  // @IsString()
  // name: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  age: number;

  @IsString()
  breed: string;
}
```

<br>

테스트 코드로는 age 를 string 형태로 아예 작성할 수 없어서 postman 으로 테스트를 수행했다. postman 으로 raw 의 json 으로 아래와 같이 작성하여 post 요청을 보냈다.

```json
{
    "age": "5",
    "breed": "korean shorthair"
}
```

<br>

controller 의 console.log 결과는 다음과 같다.

```typescript
CreateCatDTO { age: 5, breed: 'korean shorthair' }
```

<br>

ValidationPipe 와 transform: true 옵션, @Transform 을 통해 수행할 수 있었다. 

@Body() 안에 new ValidationPipe 를 작성해줘야 한다. 그리고 transform: true 를 설정해주고, DTO 클래스에 @Transform(({ value }) => parseInt(value)) 를 작성하여 value 를 parseInt 한 값을 리턴한다.

@Transform 설정을 하지 않으면 다음과 같은 에러가 발생한다.

```json
{
    "statusCode": 400,
    "message": [
        "age must be an integer number"
    ],
    "error": "Bad Request"
}
```

<br>

그리고 ValidationPipe 옵션으로 { transformOptions: { enableImplicitConversion: true } } 를 지정하면 제대로 변환되지 않고 그대로 "5" 가 나온다.

<br>

enableImplicitConversion 에 대해서 소스코드 상에는 "If set to true class-transformer will attempt conversion based on TS reflected type" 라고 주석으로 설명되어 있다. reflection 에 대한 추가 학습이 있어야 해당 문구를 잘 이해할 수 있을 듯 하다.

<br>

타입 변환이 이루어지는 정확한 원리는 아직 제대로 이해하지 못하고, 사용 방법을 익힌 상태다.

<br>

<참고>

https://docs.nestjs.com/pipes

https://docs.nestjs.com/techniques/validation

https://github.com/typestack/class-transformer

https://jojoldu.tistory.com/617?category=635878