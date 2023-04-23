import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardSearchRequestDTO } from './dto/boardSearchRequest.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('search')
  @UsePipes(new ValidationPipe({ transform: true }))
  async search(@Query() queryParam: BoardSearchRequestDTO) {
    return this.boardService.search(queryParam);
  }
}
