# imports 대신 providers

실제 코드에서는 다른 Service 를 이용할 경우 해당 Service 의 Module 을 imports 에 작성하는데, 단위 테스트에서 다른 Service 를 이용할경우 Module 을 imports 하기 보다는 직접 해당 Service 를 providers 에 작성한다.

imports 에 해당 Module 을 작성하면 이 Module 에 걸려있는 의존성까지 모두 jest 가 검사를 하면서 can't resolve dependency 에러가 발생할 수 있다. 다른 Module 의 의존성에 관계 없이 테스트할 대상에 집중할 수 있도록 필요한 Service 만 providers 로 가져온다.