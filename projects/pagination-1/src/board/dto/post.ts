export class Post<T> {
  // 테이블이 갖고 있는 전체 데이터 수
  totalCount: number;
  // totalCount 에서 pageSize 를 나눈 값
  // 총 페이지 수
  totalPage: number;
  // 한 페이지에 표시할 데이터 수
  pageSize: number;
  articles: T[];

  constructor(totalCount: number, pageSize: number, articles: T[]) {
    this.totalCount = totalCount;
    this.totalPage = Math.ceil(totalCount / pageSize);
    this.pageSize = pageSize;
    this.articles = articles;
  }
}
