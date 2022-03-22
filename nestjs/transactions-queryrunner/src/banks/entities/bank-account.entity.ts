import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class BankAccount {
  @PrimaryColumn({
    type: 'int',
  })
  MemNo: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  AccountNumber: string;

  @Column({
    type: 'int',
  })
  Balance: number;
}
