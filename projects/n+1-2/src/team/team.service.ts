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

  async getAllTeams(): Promise<Team[]> {
    return await this.teamRepository.find();
  }
}
