import { Injectable } from '@nestjs/common';
import { BoardSearchRequestDTO } from './dto/boardSearchRequest.dto';

@Injectable()
export class BoardService {
  async search(param: BoardSearchRequestDTO) {
    console.log(param);
  }
}
