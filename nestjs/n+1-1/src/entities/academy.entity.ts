import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Subject } from './subject.entity';

@Entity('Academy')
export class Academy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;
  // https://stackoverflow.com/questions/73508346/typeormerror-entity-metadata-for-xy-was-not-found
  // 파일 이름이 잘못됐다
  // entity 가 아니라 entitiy 로 작성해서 오류가 발생했다
  @OneToMany(() => Subject, (subject) => subject.academy, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    // eager: true,
    lazy: true,
  })
  // https://typeorm.io/eager-and-lazy-relations#lazy-relations
  subject: Promise<Subject>;
}
