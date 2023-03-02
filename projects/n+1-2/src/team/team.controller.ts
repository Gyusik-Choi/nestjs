import { Controller, Get, Param, ParseIntPipe, Query, UsePipes } from '@nestjs/common';
import { Team } from 'src/entities/team.entity';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  // @Get()
  // async getAllTeams(): Promise<Team[]> {
  //   return await this.teamService.getAllTeams();
  // }

  // @Get()
  // @UsePipes(ParseIntPipe)
  // async getTeam(
  //   @Query('id') id: number,
  // ): Promise<Team> {
  //   return await this.teamService.getTeam(id);
  // }

  @Get()
  async getTeams(): Promise<Team[]> {
    return await this.teamService.getTeams();
  }
}
