# Exception Filter - response.json() 검증

Exception Filter 는 로직을 수행중 exception 에러가 발생해서 클라이언트에게 이를 응답하기 전에 거치는 곳이다.

response.json() 함수의 인자값에 원하는 값을 넣어서 사용자에게 반환할 결과값을 커스터마이징 할 수 있다.

<br>

### Exception Filter 예시

아래는 [NestJS 공식문서](https://docs.nestjs.com/exception-filters) 에 나온 Exception Filter 예시 코드다. json() 함수의 인자로 statusCode, timestamp, path 값을 넣어주고 있다.

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
```

<br>

### HttpException, ArgumentHost

Exception Filter 에 대한 단위 테스트를 작성하면서 json 의 인자로 세팅된 값을 검증하고 싶었다.

단위 테스트를 수행하기 위해 Exception Filter 로 정의한 클래스의 catch 함수를 호출해야 한다. 이때 catch 함수의 인자로 HttpException, ArgumentHost 가 필요하다.

[@golevelup/ts-jest](https://github.com/golevelup/nestjs/tree/master/packages/testing) 모듈을 통해 HttpException, ArgumentHost 의 모킹을 수행할 수 있다. 

```typescript
describe('HttpExceptionFilter', () => {
  let mockHttpException: HttpException;
  let mockArgumentHost: ArgumentsHost;
  
  beforeAll(() => {
    mockHttpException = createMock<HttpException>();
    mockArgumentHost = createMock<ArgumentsHost>();
  });
});
```

<br>

위의 Exception Filter 예시 코드에서 response 객체를 ArgumentsHost 에서 얻고 있다.

```typescript
const ctx = host.switchToHttp();
const response = ctx.getResponse<Response>();
```

<br>

그리고 status 값을 HttpException 에서 얻고 있다.

```typescript
const status = exception.getStatus();
```

<br>

#### switchToHttp, getResponse

response 객체를 얻기 위해 모킹한 ArgumentHost 에 switchToHttp, getResponse 함수를 직접 정의해줘야 한다.

```typescript
describe('HttpExceptionFilter', () => {
  let mockHttpException: HttpException;
  let mockArgumentHost: ArgumentsHost;
  
  beforeAll(() => {
    mockHttpException = createMock<HttpException>();
    mockArgumentHost = createMock<ArgumentsHost>({
      switchToHttp: () => ({
        // getResponse: () => ({httpResponseMock}),
        // 위와 같은 형태로 쓰지 않도록 주의!
        getResponse: () => httpResponseMock,
        getRequest: () => httpRequestMock,
      }),
    });
  });
});
```

<br>

직접 정의한 getReponse 는 httpResponseMock 을 반환하는데, httpResponseMock 은 [node-mocks-http](https://www.npmjs.com/package/node-mocks-http) 모듈을 통해 모킹한 response 객체다.

```typescript
const httpResponseMock = httpMocks.createResponse();
const httpRequestMock = httpMocks.createRequest();
```

<br>

#### getStatus

status 값을 얻기 위해 모킹한 HttpException 에 getStatus 함수를 직접 정의해줘야 한다. getStatus 함수에서 401 상태 코드를 반환하도록 정의했다.

```typescript
describe('HttpExceptionFilter', () => {
  let mockHttpException: HttpException;
  let mockArgumentHost: ArgumentsHost;
  
  beforeAll(() => {
    mockHttpException = createMock<HttpException>({
      getStatus: () => 401,
    });
    mockArgumentHost = createMock<ArgumentsHost>({
      switchToHttp: () => ({
        // getResponse: () => ({httpResponseMock}),
        // 위와 같은 형태로 쓰지 않도록 주의!
        getResponse: () => httpResponseMock,
        getRequest: () => httpRequestMock,
      }),
    });
  });
});
```

<br>

### response.json() 검증

테스트가 동작하면서 response 의 status 함수와 json 함수를 호출한다. 

json 함수의 인자로 들어간 값에 대한 검증을 수행하려면 모킹한 response 객체인 httpResponseMock 의 _getData 혹은 _getJSONData 함수가 필요하다.

```typescript
describe('catch', () => {
  it('check response', () => {
    const response = mockArgumentHost.switchToHttp().getResponse();
    const jsonResponse = JSON.parse(response._getData());
    const jsonResponse2 = response._getJSONData();
  });
});
```

<br>

#### _getData, _getJSONData

response 객체가 json 함수를 호출하면 write 함수를 호출하게 된다. write 함수에서 _data 를 세팅하게 되는데, 이때 _data 에는 json 으로 변환한 값이 들어간다.

_data 를 얻기 위해 _getData 혹은 _getJSONData 를 호출해야 한다. _getData 는 json 형태의 _data 를 그대로 반환하고, _getJSONData 는 json 을 파싱한 _data 를 반환한다.

```javascript
// node-mocks-http 소스코드의 mockResponse.js
var EventEmitter = require('./mockEventEmitter');

function createResponse(options) {
  var _data = '';
  
  var mockResponse = Object.create(EventEmitter.prototype);
  EventEmitter.call(mockResponse);
  
  // status 함수
  mockResponse.status = function(code) {
    mockResponse.statusCode = code;
    return this;
  };
  
  // json 함수
  mockResponse.json = function(a, b) {
    mockResponse.setHeader('Content-Type', 'application/json');
    // json 의 인자로 들어온 값이 undefined 가 아니면
    // write 함수를 호출한다
    if (typeof a !== 'undefined') {
      if (typeof a === 'number' && typeof b !== 'undefined') {
        mockResponse.statusCode = a;
        mockResponse.write(JSON.stringify(b), 'utf8');
      } else if(typeof b !== 'undefined' && typeof b === 'number') {
        mockResponse.statusCode = b;
        mockResponse.write(JSON.stringify(a), 'utf8');
      } else {
        mockResponse.write(JSON.stringify(a), 'utf8');
      }
    }
    mockResponse.emit('send');
    mockResponse.end();

    return mockResponse;
  };
  
  // write 함수
  mockResponse.write = function(data, encoding) {
    mockResponse.headersSent = true;

    if (data instanceof Buffer) {
      _chunks.push(data);
      _size += data.length;
    } else {
      // _data 에 write 의 첫번째 인자로 넘어온 data 를 더해준다
      _data += data;
    }

    if (encoding) {
      _encoding = encoding;
    }
  };
  
  // _getData 함수
  mockResponse._getData = function() {
    // _data 를 반환한다
    return _data;
  };

  // _getJSONData 함수
  mockResponse._getJSONData = function() {
    // json 을 파싱한 _data 를 반환한다
    return JSON.parse(_data);
  };
}
```

<br>

#### 검증

```typescript
describe('catch', () => {
  it('check response', () => {
    const response = mockArgumentHost.switchToHttp().getResponse();
    // statusCode 는 response 객체의 status 함수를 호출할때, 모킹한 HttpException 의 getStatus 함수에 세팅한 status 함수의 반환 값이 세팅된다
    expect(response.statusCode).toEqual(401);
    
    const jsonResponse = JSON.parse(response._getData());
    const jsonResponse2 = response._getJSONData();
    expect(jsonResponse.statusCode).toEqual(401);
    expect(jsonResponse2.statusCode).toEqual(401);
  });
});
```

<br>

<참고>

https://docs.nestjs.com/exception-filters

https://www.npmjs.com/package/node-mocks-http

