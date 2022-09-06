# 다른 service 를 mocking 하지 않고 spyOn 하기

A service 에서 B service 의 함수를 이용할 경우 mocking 하는 것 보다 spyOn 을 하는것이 더 유연하게 함수의 결과를 설정할 수 있었다.

mocking 보다 spyOn 을 이용하면서 service mocking 하는 수고를 덜 수 있고, service 의 module 을 imports 하면서 실제 service 의 코드와 더 유사한 형태로 테스트 할 수 있었다. 그리고 무엇보다 개별 단위 테스트에서 service 함수의 결과를 다르게 설정할 수 있어서 편리한 장점이 있었다.

```typescript
// B.service.ts
@Injectable()
export class BService {
  async doSomething() {
    
  }
}
```

<br>

```typescript
const mockBSerivce = async () => ({ doSomething: jest.fn() });

// A.service.spec.ts
describe('A', () => {
  beforeEach(async () => {
  	 const module: TestingModule = await Test.createTestingModule({
       providers: [
         {
           provide: BService,
           useValue: mockBService(),
         }
       ]
     }).compile();
  });
  
  describe('first', () => {
    it('first', async () => {
      // doSomething 의 결과를 mockResolvedValue 로 설정하고 싶었지만 할 수 없었다
    })
  })
});
```

<br>

위의 경우 mockBService 의 doSomething 함수에 대한 결과를 AService 의 개별 함수에 대한 단위 테스트에서 다르게 설정하기가 까다로운 단점이 있었다.

아래와 같이 실제 BService 에 대한 BModule 을 imports 하되, BService 의 함수에 대한 결과를 spyOn 으로 개별 단위 테스트마다 다르게 설정할 수 있었다.

```typescript
// A.service.spec.ts
describe('A', () => {
  let bService: BService;
  
  beforeEach(async () => {
  	 const module: TestingModule = await Test.createTestingModule({
       imports: [BModule],
       providers: [],
     }).compile();
  });
    
  bService = module.get<BService>(BService);
    
    describe('first', () => {
      it('first', async () => {
        jest.spyOn(bService, 'first').mockResolvedValue('내가 원하는 결과');
      })
    })
});
```

