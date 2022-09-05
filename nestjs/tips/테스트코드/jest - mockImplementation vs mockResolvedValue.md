# mockImplementation vs mockResolvedValue

착각했던 점은 모든 mockImplementation(() => { }) 표현 자체를 mockResolvedValue()로 대체할 수 있다고 생각한 점이다.

```
jest.fn().mockImplementation(() => Promise.resolve(10));
jest.fn().mockResolvedValue(10);
```

<br>

공식문서에 따르면

>  Syntactic sugar function for:
>
>  ```
>  jest.fn().mockImplementation(() => Promise.resolve(value));
>  ```
>
>  Useful to mock async functions in async tests:

mockResolvedValue() 는 mockImplementation 의 구현 부분에서 Promise.resolve 를 하는 경우에 대한 Syntactic sugar 기능을 하는 것이지 모든 구현 부분을 대체하는게 아니다.

<br>

<참고>

https://jestjs.io/docs/mock-function-api#mockfnmockimplementationfn

https://jestjs.io/docs/mock-function-api#mockfnmockresolvedvaluevalue