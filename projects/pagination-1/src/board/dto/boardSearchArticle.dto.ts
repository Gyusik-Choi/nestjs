import { Board } from "../../entities/board.entity";

export class BoardSearchArticleDTO {
  title: string;
  content: string;

  constructor(board: Board) {
    this.title = board.title;
    this.content = board.content;
  }
}
