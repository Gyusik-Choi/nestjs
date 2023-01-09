# N + 1

ORM 의 N + 1 을 학습하기 위한 프로젝트다. N + 1 은 1개의 쿼리에 대해 데이터의 갯수 N 개 만큼의 추가적인 쿼리가 발생하는 것을 의미한다.

NestJS + TypeORM + MySQL 환경에서 진행했다.

<br>

### 테이블

#### Academy

```typescript
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

  @OneToMany(() => Subject, (subject) => subject.academy, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  subject: Subject;
}

```

<br>

### Subject

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Academy } from './academy.entity';

@Entity('Subject')
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;

  @ManyToOne(() => Academy, (academy) => academy.subject, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'academy_id', referencedColumnName: 'id' }])
  academy: Academy;
}

```

<br>

Academy 와 Subject 가 1:N 관계를 갖고 있으며 Subject 에 academy_id 컬럼으로 Academy 의 id 컬럼에 대한 foreign key 를 갖는다. Academy 에는 2개의 데이터, Subject 는 Academy 하나의 데이터에 대해 외래키를 갖는 데이터가 5개씩 총 10개의 데이터를 갖고 있다.

<br>

### Eager Loading

```typescript
@Entity('Academy')
export class Academy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;

  @OneToMany(() => Subject, (subject) => subject.academy, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    eager: true,
  })
  subject: Subject;
}
```

<br>

```typescript
// controller
@Controller('academy')
export class AcademyController {
  constructor(private readonly academyService: AcademyService) {}

  @Get('academies')
  async getAllAcademies() {
    return this.academyService.getAllAcademies();
  }
}
```

<br>

```typescript
// service
@Injectable()
export class AcademyService {
  constructor(
    @InjectRepository(Academy)
    private readonly academyRepository: Repository<Academy>,

    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  getAllAcademies() {
    return this.academyRepository.find();
  }
}
```

<br>

```bash
curl -X GET "http://localhost:3000/academy/academies"
```

<br>

```
query: SELECT `Academy`.`id` AS `Academy_id`, `Academy`.`name` AS `Academy_name`, `Academy_subject`.`id` AS `Academy_subject_id`, `Academy_subject`.`name` AS `Academy_subject_name`, `Academy_subject`.`academy_id` AS `Academy_subject_academy_id` FROM `Academy` `Academy` LEFT JOIN `Subject` `Academy_subject` ON `Academy_subject`.`academy_id`=`Academy`.`id`
```

<br>

Eager Loading 으로 Academy 의 모든 데이터를 조회했을 때, Subject 의 내용까지 한번에 Left Join 으로 불러와서 N + 1 쿼리는 발생하지 않았다. 이 부분은 Spring 에서 대표적으로 사용되는 ORM 인 JPA 와는 다른 양상이다. JPA 에서는 Fetch 타입을 Eager 로 설정하더라도 N + 1 쿼리가 발생한다(findAll() 과 findById() 의 내부 동작 방식이 다르다고 한다. findAll() 에서 N + 1 쿼리가 발생하는데 findById() 에서는 N + 1 쿼리가 발생하지 않는 것으로 보이는데 확실하지 않아서 이에 대한 추가 학습이 필요하다).

<br>

### Lazy Loading

```typescript
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
    lazy: true,
  })
  subject: Subject;
}
```

<br>

```typescript
// controller
@Controller('academy')
export class AcademyController {
  constructor(private readonly academyService: AcademyService) {}

  @Get('academies')
  async getAllAcademies() {
    return this.academyService.getAllAcademies();
  }
}
```

<br>

```typescript
// service
@Injectable()
export class AcademyService {
  constructor(
    @InjectRepository(Academy)
    private readonly academyRepository: Repository<Academy>,

    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async getAllAcademies(): Promise<Academy[]> {
    const academies: Academy[] = await this.academyRepository.find();

    for (const academy of academies) {
      const subject = await academy.subject;
    }

    return academies;
  }
}
```

<br>

```
query: SELECT `Academy`.`id` AS `Academy_id`, `Academy`.`name` AS `Academy_name` FROM `Academy` `Academy`
query: SELECT `subject`.`id` AS `subject_id`, `subject`.`name` AS `subject_name`, `subject`.`academy_id` AS `subject_academy_id` FROM `Subject` `subject` WHERE `subject`.`academy_id` IN (?) -- PARAMETERS: [1]
query: SELECT `subject`.`id` AS `subject_id`, `subject`.`name` AS `subject_name`, `subject`.`academy_id` AS `subject_academy_id` FROM `Subject` `subject` WHERE `subject`.`academy_id` IN (?) -- PARAMETERS: [2]
```

<br>

Academy 의 Entity 에 subject 에 대한 lazy: true 옵션을 적용했더니 N + 1 쿼리가 발생했다.

<br>

이를 피하기 위한 2가지 방법이 있다. find 안에 옵션으로 relations 을 적용하는 방법과 QueryBuiler 를 사용하는 방법이 있다.

<br>

#### relations

```typescript
// service
@Injectable()
export class AcademyService {
  constructor(
    @InjectRepository(Academy)
    private readonly academyRepository: Repository<Academy>,

    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async getAllAcademies(): Promise<Academy[]> {
    // Lazy Loading 에서 N + 1 을 피하는 방법 1
    const academies: Academy[] = await this.academyRepository.find({
      relations: ['subject'],
    });

    for (const academy of academies) {
      const subject = await academy.subject;
    }

    return academies;
  }
}
```

<br>

find 메소드 안에 relations 키에 대한 값으로 Academy 의 entity 에 작성한 subject 를 문자열 리터럴 형태로 설정한다.

<br>

#### QueryBuilder

```typescript
// service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Academy } from '../entities/academy.entity';
import { Subject } from '../entities/subject.entity';

@Injectable()
export class AcademyService {
  constructor(
    @InjectRepository(Academy)
    private readonly academyRepository: Repository<Academy>,

    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async getAllAcademies(): Promise<Academy[]> {
    // Lazy Loading 에서 N + 1 을 피하는 방법 2
    return this.academyRepository
      .createQueryBuilder('academy')
      .leftJoinAndSelect('academy.subject', 'subject')
      .getMany();
  }
}

```

<br>

> Eager relations only work when you use `find*` methods. If you use `QueryBuilder`eager relations are disabled and have to use `leftJoinAndSelect` to load the relation.

[공식문서](https://typeorm.io/eager-and-lazy-relations#eager-relations)에 따르면 위와 같이 QueryBuilder 에서는 eager relations 가 동작하지 않는다고 하는데 lazy relations 도 마찬가지로 동작하지 않는다. 직접 leftJoinAndSelect 를 통해서 연관 관계의 테이블 값을 가져와야 한다.

아래의 코드는 eager, lazy 모두 Academy 테이블의 내용을 가져오지만 Subject 테이블의 내용은 가져오지 못한다.

<br>

```typescript
// service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Academy } from '../entities/academy.entity';
import { Subject } from '../entities/subject.entity';

@Injectable()
export class AcademyService {
  constructor(
    @InjectRepository(Academy)
    private readonly academyRepository: Repository<Academy>,

    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async getAllAcademies(): Promise<Academy[]> {
    // 이는 Eager Loading, Lazy Loading 둘 다 subject 를 가져오지 않는다
    // Academy 의 내용만 가져온다
		return this.academyRepository.createQueryBuilder('academy').getMany();
  }
}

```

<br>

https://typeorm.io

https://tristy.tistory.com/36

https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=wideeyed&logNo=221350638501

https://jojoldu.tistory.com/165

https://velog.io/@jinyoungchoi95/JPA-모든-N1-발생-케이스과-해결책

https://www.popit.kr/jpa-n1-발생원인과-해결-방법/

