import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('board')
export class Board {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
  })
  content: string
}
