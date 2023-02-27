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

  async getPlayer(id: number) {
    return await this.playerRepository.findOne({
      where: {
        Idx: id,
      },
    });
  }

  async getAllPlayers() {
    return await this.playerRepository.find();
  }
}
