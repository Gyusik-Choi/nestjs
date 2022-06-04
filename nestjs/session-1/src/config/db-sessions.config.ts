import * as sessionMySQLStore from 'express-mysql-session';
import * as session from 'express-session';

const options = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  clearExpired: true,
  checkExpirationInterval: 30000,
  expiration: 60000,
};

const MySQLStore = sessionMySQLStore(session);
const sessionStore: sessionMySQLStore.MySQLStore = new MySQLStore(options);

// 한참을 괴롭힌 에러
// 위에 선언한 sessionStore 를 sessionOptions 의 store 의 값으로 넣으려는 것과 관련한 에러였다
// => 내보낸 변수 'sessionOptions'이(가) 외부 모듈 "/Users/kuidoli/Dev/typeScript/nestjs/personal/session-1/node_modules/@types/express-mysql-session/index"의 'MySQLStoreClass' 이름을 가지고 있거나 사용 중이지만 명명할 수 없습니다.ts(4023)
// https://github.com/microsoft/TypeScript/issues/5711
// https://github.com/microsoft/TypeScript/issues/9944#issuecomment-244448079
// https://stackoverflow.com/questions/44920856/how-to-use-express-mysql-session-in-typescript-projects
// https://errorsfixing.com/express-mysql-session-store-with-typescript/
// import 혹은 type annotation 과 연관이 있는듯 한데 sessionStore 에 MySQLStoreClass 타입을 선언할 수 없었고
// any 를 대입했더니 에러는 사라졌지만
// 이 문제의 정확한 원인과 해결방법을 아직 모르겠다...
// => 위의 경로로 가서 index.d.ts 파일을 살펴보니 export = MySQLStore; 를 하고 있다
// MySQLStore 는 type guard 로 typeof MySQLStoreClass 를 사용하고 있는데
// MySQLStoreClass 는 import 가 되지 않아서 이곳에서는 사용할 수 없는데
// sessionStore 의 type 이 MySQLStoreClass 로 컴파일러가 추론한다
// 해당 MySQLStoreClass 는 이곳으로 불러오지 못하므로 sessionStore 의 type annotation 으로 설정하지 못하면서 문제가 발생했다고 생각한다
// 그래서 sessionStore 에 sessionStore: sessionMySQLStore.MySQLStore 이렇게 type annotation 만 설정하면 해결이 안되고
// sessionOptions 전체의 type 을 설정하면서 store 에 타입을 MySQLStoreClass 가 아니라 sessionMySQLStore.MySQLStore 라고 선언해주면서
// 더 이상 컴파일러가 store 의 타입을 MySQLStoreClass 라고 추론하지 않도록 설정하면서 해결할 수 있었다
// 그리고나서 sessionStore 에 sessionStore: sessionMySQLStore.MySQLStore 타입을 선언해주어도 문제가 없었다

type sessionOptionsType = {
  secret: string;
  store: sessionMySQLStore.MySQLStore;
  resave: boolean;
  saveUninitialized: boolean;
  cookie: {
    maxAge: number;
  };
};

export const sessionOptions: sessionOptionsType = {
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 120000,
  },
};
