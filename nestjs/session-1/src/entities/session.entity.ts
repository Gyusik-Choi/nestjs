import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sessions')
export class Sessions {
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
