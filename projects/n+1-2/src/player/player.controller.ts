import { Controller, Get } from '@nestjs/common';
import { Param, UsePipes } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
  constructor(
    private readonly playerService: PlayerService,
  ) {}

  @Get()
  async getAllPlayers() {
    return await this.playerService.getAllPlayers();
  }

  @Get(':id')
  @UsePipes(ParseIntPipe)
  async getPlayer(
    @Param('id') id: number,
  ) {
    return await this.playerService.getPlayer(id);
  }
}
