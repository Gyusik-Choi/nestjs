# jest - spyOn 수행 결과값 확인하는 방법

nestjs 에서 jest 기반 테스트코드를 작성하면서 spyOn 을 수행하고 어떤 값이 도출되었는지를 알고 싶었는데 이 spyOn 의 수행 결과 값에 접근하기가 쉽지 않았다.

spyOn 을 수행한 값을 변수로 받고 이 변수를 보면 마치 mockResolvedValue 로 값을 설정하는 것처럼 예상한 값이 그대로 나올줄 알았는데 그렇지 않았다.

spyOn 메서드의 결과값을 확인해보면 아래와 같다.

```
[Function: mockConstructor] {
      _isMockFunction: true,
      getMockImplementation: [Function (anonymous)],
      mock: [Getter/Setter],
      mockClear: [Function (anonymous)],
      mockReset: [Function (anonymous)],
      mockRestore: [Function (anonymous)],
      mockReturnValueOnce: [Function (anonymous)],
      mockResolvedValueOnce: [Function (anonymous)],
      mockRejectedValueOnce: [Function (anonymous)],
      mockReturnValue: [Function (anonymous)],
      mockResolvedValue: [Function (anonymous)],
      mockRejectedValue: [Function (anonymous)],
      mockImplementationOnce: [Function (anonymous)],
      mockImplementation: [Function (anonymous)],
      mockReturnThis: [Function (anonymous)],
      mockName: [Function (anonymous)],
      getMockName: [Function (anonymous)]
      }
```

<br>

이 중 mock 프로퍼티를 보면 Getter/Setter 로 되어있다.

```javascript
const spyOnResult = jest.spyOn(service, 'method');

console.log(spyOnResult.mock);
//  { calls: [], instances: [], invocationCallOrder: [], results: [] }
```

<br>

mock 의 results 에 접근해보면 type 와 value 를 갖는 객체가 배열에 담겨있다. value 의 값은 Promise 를 반환하는데 이는 await 로 접근할 수 있다.

참고로 Promise 의 {[ null, undefined ]} 는 위의 spyOn 으로 수행하는 'method' 가 거치는 mock repository 의 메소드의mockResolvedValue 로 설정한 값이다. 정상적으로 수행했음을 알 수 있다.

```javascript
console.log(spyOnResult.mock.results);
// [{ type: 'return', value: Promise { [ null, undefined ] } }]

console.log(await spyOnResult.mock.results[1].value);
// [null, undefined]

expect(await spyOnResult.mock.results[1].value).toEqual([null, undefined]);
```

<br>

spyOne 의 결과값을 이렇게 접근하여 expect 로 검증하는게 옳은 테스트코드 작성 방법인지는 아직 잘 모르겠다...

<참고>

https://silvenon.com/blog/mocking-with-jest/functions