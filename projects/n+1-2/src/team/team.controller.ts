import { Controller, Get } from '@nestjs/common';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
  ) {}

  @Get('teams')
  async getAllTeams() {
    return await this.teamService.getAllTeams();
  }
}
