import { Controller, Get } from '@nestjs/common';
import { Param, Query, UsePipes } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
  constructor(
    private readonly playerService: PlayerService,
  ) {}
  
  // http://localhost:3000/player?id=1 과 같은 요청을 보내고 싶다면
  // @Get() 에 :id 를 쓰는게 아니다!
  // @Get() 은 비워두고
  // @Query 에 작성해야 한다
  // https://kimmanbo.tistory.com/18
  @Get()
  @UsePipes(ParseIntPipe)
  async getPlayer(
    @Query('id') id: number,
  ) {
    return await this.playerService.getPlayer(id);
  }

  @Get()
  async getAllPlayers() {
    return await this.playerService.getAllPlayers();
  }
}
