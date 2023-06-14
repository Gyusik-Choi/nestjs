import { Controller, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardSearchRequestDTO } from './dto/board-search-request.dto';

@Controller('board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
  ) {}

  @Get('search')
  @UsePipes(new ValidationPipe({ transform: true }))
  async search(
    @Param() req: BoardSearchRequestDTO,
  ) {
    return await this.boardService.search(req);
  }
}
