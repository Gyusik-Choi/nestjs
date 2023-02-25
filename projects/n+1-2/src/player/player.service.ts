import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from 'src/entities/player.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>
  ) {}

  async getAllPlayers() {
    return await this.playerRepository.find();
  }

  async getPlayer(id: number) {
    console.log(id);
    return await this.playerRepository.findOne({
      where: {
        Idx: id,
      }
    });
  }
}
