import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('UserAccount')
export class UserAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'tinyint',
    nullable: false,
    default: false,
  })
  emailVerification: boolean;
}
