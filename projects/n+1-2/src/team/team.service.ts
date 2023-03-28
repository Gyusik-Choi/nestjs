import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coach } from 'src/entities/coach.entity';
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
    // 1) 두번의 쿼리 발생 (distinct 쿼리)
    // const team: Team = await this.teamRepository.findOne({
    //   where: {
    //     Idx: id,
    //   }
    // })
    // const players: Player[] = await team.Players;
    // return team;

    // 2) relations 옵션을 걸어도 마찬가지로 두번의 쿼리 발생 (distinct 쿼리)
    // 이는 eager, lazy 모두 똑같은 결과가 나온다
    // const team: Team = await this.teamRepository.findOne({
    //   where: {
    //     Idx: id
    //   },
    //   // relations: ['Players'],
    // })
    // const players: Player[] = await team.Players;
    // return team;

    // 3) 한번의 쿼리 발생
    const team: Team = await this.teamRepository
      .createQueryBuilder('Team')
      // .leftJoinAndSelect(Player, 'player', 'team.Idx = player.idx')
      // 위와 같이 작성하면 N + 1 쿼리 발생한다
      // https://typeorm.io/select-query-builder#joining-relations
      .leftJoinAndSelect('Team.Players', 'Player')
      .where('Team.Idx = :id', {id: id})
      .getOne();
    const players: Player[] = await team.Players;
    return team;
  }

  async getTeams(): Promise<Team[]> {
    // 1)
    const team: Team[] = await this.teamRepository
      .createQueryBuilder('Team')
      // .leftJoinAndSelect(Player, 'player', 'team.Idx = player.idx')
      // 위와 같이 작성하면 N + 1 쿼리 발생한다
      // https://typeorm.io/select-query-builder#joining-relations
      .leftJoinAndSelect('Team.Players', 'Player')
      .leftJoinAndSelect('Team.Coach', 'Coach')
      .getMany();
    // const players: Player[] = await team.Players;

    for (const t of team) {
      const player: Player[] = await t.Players;
      const coach: Coach[] = await t.Coach;
    }
    
    return team;

    // 2)
    // const team: Team[] = await this.teamRepository.find({
    //   // where: {
    //   //   // https://typeorm.io/find-options#advanced-options
    //   //   // https://stackoverflow.com/questions/50705276/typeorm-postgres-where-any-or-in-with-querybuilder-or-find
    //   //   Idx: In([1, 2]),
    //   // },
    //   relations: ['Players', 'Coach'],
    // })

    // for (const t of team) {
    //   const player: Player[] = await t.Players;
    //   const coach: Coach[] = await t.Coach;
    // }

    // return team;
  }
}
