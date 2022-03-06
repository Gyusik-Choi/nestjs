import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('UserAccount')
export class UserAccount {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({
    type: 'varchar',
  })
  EMAIL: string;

  @Column({
    type: 'varchar',
  })
  PASSWORD: string;
}
