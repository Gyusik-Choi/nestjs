import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from 'src/entities/player.entity';
import { Team } from 'src/entities/team.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Team>,
  ) {}

  async getTeam(id: number): Promise<Team> {
    const team: Team = await this.teamRepository.findOne({
      where: {
        Idx: id,
      }
    })

    await team.Players;

    return team;
  }

  async getAllTeams(): Promise<Team[]> {
    const team: Team[] = await this.teamRepository.find();

    for (const t of team) {
      const player: Player[] = await t.Players;
    }

    return team;
  }
}
