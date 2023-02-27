import { Controller, Get, Param, ParseIntPipe, Query, UsePipes } from '@nestjs/common';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async getAllTeams() {
    return await this.teamService.getAllTeams();
  }

  @Get()
  @UsePipes(ParseIntPipe)
  async getTeam(
    @Query('id') id: number,
  ) {
    return await this.teamService.getTeam(id);
  }
}
