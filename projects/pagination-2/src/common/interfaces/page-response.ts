export class PageResponse<T> {
  pageSize: number;
  nextIdx: number;
  items: T[];

  constructor(
    pageSize: number,
    nextIdx: number,
    items: T[],
  ) {
    this.pageSize = pageSize;
    this.nextIdx = nextIdx;
    this.items = items;
  }
}
