import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ExpressSessions')
export class ExpressSessions {
  @PrimaryColumn({
    type: 'varchar',
  })
  session_id: string;

  @Column({
    type: 'int',
  })
  expires: number;

  @Column({
    type: 'mediumtext',
  })
  data: any;
}
