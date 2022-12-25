import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Fake')
export class Fake {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;
}
