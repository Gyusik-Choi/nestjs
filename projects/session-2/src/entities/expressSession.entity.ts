import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ExpressSession')
export class ExpressSession {
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
