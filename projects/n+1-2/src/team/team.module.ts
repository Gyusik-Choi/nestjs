import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from 'src/entities/team.entity';
import { Player } from 'src/entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Player])],
  providers: [TeamService],
  controllers: [TeamController]
})
export class TeamModule {}
