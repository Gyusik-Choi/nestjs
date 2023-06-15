export class PageResponse<T> {
  totalSize: number;
  totalPage: number;
  pageSize: number;
  nextIdx: number;
  items: T[];

  constructor(
    totalSize: number,
    pageSize: number,
    nextIdx: number,
    items: T[],
  ) {
    this.totalSize = totalSize;
    this.totalPage = Math.ceil(totalSize / pageSize);
    this.pageSize = pageSize;
    this.nextIdx = nextIdx;
    this.items = items;
  }
}
