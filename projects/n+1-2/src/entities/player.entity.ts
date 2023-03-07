import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { ManyToOne } from "typeorm/decorator/relations/ManyToOne";
import { Team } from "./team.entity";

@Entity('player')
export class Player {
  @PrimaryGeneratedColumn()
  Idx: number;

  @ManyToOne(() => Team, (team) => team.Players, {
    lazy: true,
  })
  // https://tristy.tistory.com/36
  // @JoinColumn([{ name: 'Idx' }])
  // join column 을 잘못 설정했다
  // DB 에서 player table 의 외래키로 사용하는 컬럼은 Team 이다
  // Idx 컬럼은 Player 테이블의 AUTO_INCREMENT 되는 PRIMARY KEY 다
  // @JoinColumn([{ name: 'Team', referencedColumnName: 'Idx' }])
  @JoinColumn([{ name: 'Team'}])
  Team: Promise<Team>;

  @Column({
    type: 'varchar',
    length: 50,
  })
  PlayerName: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Country: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Position: string;

  @Column({
    type: 'int',
  })
  BackNumber: number;
}
