import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('UserAccount')
export class UserAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 200,
  })
  password: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  emailVerification: boolean;
}
