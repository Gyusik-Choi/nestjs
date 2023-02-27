import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from 'src/entities/player.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async getAllPlayers(): Promise<Player[]> {
    const players: Player[] = await this.playerRepository.find();

    for (const p of players) {
      await p.Team;
    }

    return players;
  }

  async getPlayer(id: number): Promise<Player> {
    const player: Player = await this.playerRepository.findOne({
      where: {
        Idx: id,
      },
    });

    await player.Team;

    return player;
  }
}
