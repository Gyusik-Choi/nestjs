// https://m.blog.naver.com/pcmola/222096791100
// https://velog.io/@ash/TypeScript%EB%A1%9C-express-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0
// https://velog.io/@ansrjsdn/TypeScript-%EC%84%A4%EC%B9%98-%EB%B0%8F-%EC%84%A4%EC%A0%95
// https://velog.io/@jjunyjjuny/NPM-TypeScript-React%EB%A1%9C-%EC%A0%9C%EC%9E%91%ED%95%9C-Component-Library-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0
// https://choseongho93.tistory.com/284
// https://darrengwon.tistory.com/116

import express from 'express';

const app = express();

app.get('/', (req: express.Request, res: express.Response) => {
    res.send("hello world");
})

app.listen(3000, () => {
    console.log("typescript server starts!");
});
