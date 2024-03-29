import { Board } from "../../entities/board.entity";

export class BoardSearchReseponseDTO {
  idx: number;
  title: string;
  content: string;

  constructor(board: Board) {
    this.idx = board.idx;
    this.title = board.title;
    this.content = board.content;
  }
}
