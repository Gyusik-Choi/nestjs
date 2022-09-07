# jest - spyOn 의 mockResolvedValue 를 실제 함수의 리턴 타입과 맞추기

```typescript
// A Service
const a = function(): [null, number] {
	return [null, 1];
}
```

<br>

위 함수의 리턴 값은 배열로서 첫번째 인덱스는 null, 두번째는 정수형이 반환된다. 아래처럼 boolean 값을 mockResolvedValue 로 설정하면 에러가 발생한다.

```javascript
jest.spyOn(A, 'a').mockResolvedValue(true)
// 에러 발생
```

<br>

아래와 같이 타입을 맞춰주면 에러가 발생하지 않는다.

```typescript
jest.spyOn(A, 'a').mockResolvedValue([null, 100]);
```



