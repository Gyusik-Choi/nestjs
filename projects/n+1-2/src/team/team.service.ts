import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from 'src/entities/player.entity';
import { Team } from 'src/entities/team.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Team>,
  ) {}

  async getAllTeams(): Promise<Team[]> {
    const team: Team[] = await this.teamRepository.find();

    for (const t of team) {
      const players: Player[] = await t.Players;
    }

    return team;
  }

  async getTeam(id: number): Promise<Team> {
    const team: Team = await this.teamRepository.findOne({
      where: {
        Idx: id,
      }
    })

    const players: Player[] = await team.Players;

    return team;
  }

  async getTeams(): Promise<Team[]> {
    const team: Team[] = await this.teamRepository.find({
      where: {
        // https://typeorm.io/find-options#advanced-options
        // https://stackoverflow.com/questions/50705276/typeorm-postgres-where-any-or-in-with-querybuilder-or-find
        Idx: In([1, 2]),
      }
    })

    for (const t of team) {
      const player: Player[] = await t.Players;
    }

    return team;
  }
}
