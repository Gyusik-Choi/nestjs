import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ManyToOne } from "typeorm/decorator/relations/ManyToOne";
import { Team } from "./team.entity";

@Entity('Player')
export class Player {
  @PrimaryGeneratedColumn()
  Idx: number;

  @ManyToOne(() => Team, (team) => team.Players)
  Team: Team;

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
