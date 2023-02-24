import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Player } from "./player.entity";

@Entity('Team')
export class Team {
  @PrimaryGeneratedColumn()
  Idx: number;

  @OneToMany(() => Player, (player) => player.Team)
  Players: Player[];

  @Column({
    type: 'varchar',
    length: 50,
  })
  TeamName: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Country: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  League: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Region: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Stadium: string;
}
