export abstract class PageRequest {
  private pageSize = 10;

  get pageLimit() {
    return this.pageSize;
  }
}
