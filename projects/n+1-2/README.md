# N + 1

### 1. 연관관계 - 테이블 vs 객체

> 참조를 통한 연관관계는 언제나 단방향이다. 객체간에 연관관계를 양방향으로 만들고 싶으면 반대쪽에도 필드를 추가해서 참조를 보관해야 한다. 결국 연관관계를 하나 더 만들어야 한다. 이렇게 양쪽에서 서로 참조하는 것을 양방향 연관관계라 한다. 하지만 정확히 이야기하면 이것은 양방향 관계가 아니라 서로 다른 단방향 관계 2개다. 반면에 테이블은 외래 키 하나로 양방향으로 조인할 수 있다. - 자바 ORM 표준 JPA 프로그래밍 p.166 -

<br>

### @JoinColumn

> [`@JoinColumn` not only defines which side of the relation contains the join column with a foreign key, but also allows you to customize join column name and referenced column name.](https://typeorm.io/relations#joincolumn-options)
>
> @JoinColumn 은 어느쪽에서 외래키로 조인할 컬럼을 가질지 정의하는 것 뿐만 아니라, 조인 컬럼 이름과 참조된 컬럼 이름을 변경할 수 있도록 한다.

@ManyToOne 관계에서는 @JoinColumn 이 선택적인데, @OneToOne 관계에서는 @JoinColumn 이 필수다.

<br>

#### @JoinColumn - name

> [This code will create a `categoryId` column in the database. If you want to change this name in the database you can specify a custom join column name:](This code will create a `categoryId` column in the database. If you want to change this name in the database you can specify a custom join column name:)

<br>

#### @JoinColumn - referencedColumnName 

> [Join columns are always a reference to some other columns (using a foreign key). By default your relation always refers to the primary column of the related entity. If you want to create relation with other columns of the related entity - you can specify them in `@JoinColumn` as well:](Join columns are always a reference to some other columns (using a foreign key). By default your relation always refers to the primary column of the related entity. If you want to create relation with other columns of the related entity - you can specify them in `@JoinColumn` as well:)

<br>

#### name vs referencedColumnName

 name 은 해당 엔티티의 컬럼 정보라면, referencedColumnName 은 참조할 테이블의 컬럼 정보다.

<br>

Team 엔티티

```typescript
@Entity('team')
export class Team {
  @PrimaryGeneratedColumn()
  Idx: number;

  @OneToMany(() => Player, (player) => player.Team, {
    eager: true,
    // lazy: true,
  })
  // Players: Player[];
  Players: Promise<Player[]>;

  @Column({
    type: 'varchar',
    length: 50,
  })
  TeamName: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Country: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  League: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Region: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Stadium: string;
}
```

<br>

Player 엔티티

```typescript
import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { ManyToOne } from "typeorm/decorator/relations/ManyToOne";
import { Team } from "./team.entity";

@Entity('player')
export class Player {
  @PrimaryGeneratedColumn()
  Idx: number;

  @ManyToOne(() => Team, (team) => team.Players, {
    lazy: true,
  })
  // name 속성을 지정하지 않으면
  // Error: Unknown column 'Player.teamIdx' in 'field list' 에러가 발생한다
  // @JoinColumn([{ name: 'Team' }])
  Team: Promise<Team>;

  @Column({
    type: 'varchar',
    length: 50,
  })
  PlayerName: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Country: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Position: string;

  @Column({
    type: 'int',
  })
  BackNumber: number;
}
```

<br>

TeamController

```typescript
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @UsePipes(ParseIntPipe)
  async getTeam(
    @Query('id') id: number,
  ): Promise<Team> {
    return await this.teamService.getTeam(id);
  }
}
```

<br>

TeamService

```typescript
async getTeam(id: number): Promise<Team> {
  const team: Team = await this.teamRepository
    .createQueryBuilder('Team')
    .leftJoinAndSelect('Team.Players', 'Player')
    .where('Team.Idx = :id', {id: id})
    .getOne();

  const players: Player[] = await team.Players;

  return team;
}
```

<br>

위와 같이 Team 엔티티와 Player 엔티티를 left join 할 때 @JoinColumn의 name 속성을 지정하지 않으면 아래와 같은 에러가 발생한다.

```sql
-- Player.teamIdx 로 조회한다
query failed: SELECT `Team`.`Idx` AS `Team_Idx`, `Team`.`TeamName` AS `Team_TeamName`, `Team`.`Country` AS `Team_Country`, `Team`.`League` AS `Team_League`, `Team`.`Region` AS `Team_Region`, `Team`.`Stadium` AS `Team_Stadium`, `Player`.`Idx` AS `Player_Idx`, `Player`.`PlayerName` AS `Player_PlayerName`, `Player`.`Country` AS 
`Player_Country`, `Player`.`Position` AS `Player_Position`, `Player`.`BackNumber` AS `Player_BackNumber`, `Player`.`teamIdx` AS `Player_teamIdx` 
FROM `team` `Team` 
LEFT JOIN `player` `Player`
ON `Player`.`teamIdx`=`Team`.`Idx`
WHERE `Team`.`Idx` = ? -- PARAMETERS: [1]

Error: Unknown column 'Player.teamIdx' in 'field list'
```

<br>

name 속성을 지정하지 않으면 외래키 정보를 갖는 컬럼명(첫글자는 소문자로 바꾼다)과 참조하고 있는 테이블의 기본키 컬럼명을 합쳐서 컬럼명을 잡는다.

예를 들어, Team 의 기본키가 Id 이고 Team 의 Id 를 바라보는 Player 의 외래키가 Team 이면 Player.teamId 로 조회한다.

아래의 에러가 발생한 상황은 Team 의 기본키가 Idx 이고 Team 의 Idx 를 바라보는 Player 의 외래키가 Team 인 경우다.

```bash
ERROR [ExceptionsHandler] Unknown column 'Player.teamIdx' in 'field list'
QueryFailedError: Unknown column 'Player.teamIdx' in 'field list'
```

<br>

에러를 해결하기 위해 JoinColumn 데코레이터에 1) name 속성을 지정하거나 2) Player 엔티티와 매핑된 DB 의 player 테이블의 Team 컬럼을 TeamIdx(teamIdx 도 가능) 로 변경한다. 그리고 Player 엔티티는 그대로 Team 으로 둔다.

<br>

##### 1) name 속성을 지정

Player 엔티티의 Team 컬럼이 teamIdx 로 조회되지 않도록 name 속성을 설정해주면 에러가 발생하지 않는다.

```typescript
@Entity('player')
export class Player {
  @PrimaryGeneratedColumn()
  Idx: number;

  @ManyToOne(() => Team, (team) => team.Players, {
    lazy: true,
  })
  @JoinColumn([{ name: 'Team'}])
  Team: Promise<Team>;

  @Column({
    type: 'varchar',
    length: 50,
  })
  PlayerName: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Country: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Position: string;

  @Column({
    type: 'int',
  })
  BackNumber: number;
}

```

<br>

##### referencedColumnName 을 Idx 로 해도 무방하다 (안해도 된다).

referencedColumnName 은 참조할 테이블의 기본키를 설정하는 값이라서 참조할 테이블의 기본키는 이미 Idx 라서 설정해도 되고 안 해도 된다.

```typescript
@Entity('player')
export class Player {
  @PrimaryGeneratedColumn()
  Idx: number;

  @ManyToOne(() => Team, (team) => team.Players, {
    lazy: true,
  })
  @JoinColumn([{ name: 'Team', referencedColumnName: 'Idx' }])
  Team: Promise<Team>;

  @Column({
    type: 'varchar',
    length: 50,
  })
  PlayerName: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Country: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Position: string;

  @Column({
    type: 'int',
  })
  BackNumber: number;
}
```



<br>

##### 2) DB 테이블 컬럼명 변경 + 엔티티 그대로 유지

DB player 테이블의 컬럼명은 TeamIdx, Player 엔티티의 컬럼명은 Team, Team 엔티티의 기본키는 Idx 이라서 TeamIdx 에 대해서 Player 엔티티의 Team 과 Team 엔티티의 Idx 를 합쳐서 TeamIdx 로 player 테이블의 TeamIdx 를 조회한다.

```sql
-- 테이블
alter table player change Team TeamIdx int;
```

<br>

```typescript
@Entity('player')
export class Player {
  @PrimaryGeneratedColumn()
  Idx: number;

  @ManyToOne(() => Team, (team) => team.Players, {
    lazy: true,
  })
  Team: Promise<Team>;

  @Column({
    type: 'varchar',
    length: 50,
  })
  PlayerName: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Country: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Position: string;

  @Column({
    type: 'int',
  })
  BackNumber: number;
}

```



<br>

### 2. eager loading

#### 조회할 대상 엔티티에 eager: true 속성을 설정해야 한다.

Player 를 조회할때 eager: true 속성을 Player 엔티티에 설정하면 Team 엔티티의 내용까지 left Join 으로 한번에 조회하면서 eager loading 이 적용된다.

<br>

Team 엔티티

```typescript
@Entity('team')
export class Team {
  @PrimaryGeneratedColumn()
  Idx: number;

  @OneToMany(() => Player, (player) => player.Team, {
    // eager: true,
  })
  Players: Player[];

  @Column({
    type: 'varchar',
    length: 50,
  })
  TeamName: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Country: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  League: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Region: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Stadium: string;
}

```

<br>

Player 엔티티

```typescript
@Entity('player')
export class Player {
  @PrimaryGeneratedColumn()
  Idx: number;

  @ManyToOne(() => Team, (team) => team.Players, {
    eager: true,
  })
  @JoinColumn([{ name: 'Idx' }])
  Team: Team;

  @Column({
    type: 'varchar',
    length: 50,
  })
  PlayerName: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Country: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Position: string;

  @Column({
    type: 'int',
  })
  BackNumber: number;
}

```

<br>

PlayerService

```typescript
@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>
  ) {}

  async getAllPlayers() {
    return await this.playerRepository.find();
  }
}
```

<br>

쿼리 결과

```sql
SELECT 
	`Player`.`Idx` AS `Player_Idx`, 
	`Player`.`PlayerName` AS `Player_PlayerName`, 
	`Player`.`Country` AS `Player_Country`, 
	`Player`.`Position` AS `Player_Position`, 
	`Player`.`BackNumber` AS `Player_BackNumber`, 
	`Player_Team`.`Idx` AS `Player_Team_Idx`, 
	`Player_Team`.`TeamName` AS `Player_Team_TeamName`, 
	`Player_Team`.`Country` AS `Player_Team_Country`,
	`Player_Team`.`League` AS `Player_Team_League`, 
	`Player_Team`.`Region` AS `Player_Team_Region`, 
	`Player_Team`.`Stadium` AS `Player_Team_Stadium` 
FROM 
	`player` `Player` 
LEFT JOIN 
	`team` `Player_Team` 
ON 
	`Player_Team`.`Idx`=`Player`.`Idx`
```

<br>

#### 조회할 대상 엔티티가 아닌 참조할 대상 엔티티에 eager: true 속성을 설정하면 eager loading 이 적용되지 않는다.

반면에 Player 엔티티가 아닌 Team 엔티티에 eager: true 를 설정하고 Player 를 조회하면 Team 을 조회하지 않는다. eager loading 이 적용되지 않았다.

<br>

Team 엔티티

```typescript
@Entity('team')
export class Team {
  @PrimaryGeneratedColumn()
  Idx: number;

  @OneToMany(() => Player, (player) => player.Team, {
    eager: true,
  })
  Players: Player[];

  @Column({
    type: 'varchar',
    length: 50,
  })
  TeamName: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Country: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  League: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Region: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Stadium: string;
}
```

<br>

Player 엔티티

```typescript
@Entity('player')
export class Player {
  @PrimaryGeneratedColumn()
  Idx: number;

  @ManyToOne(() => Team, (team) => team.Players, {
    // eager: true,
  })
  @JoinColumn([{ name: 'Idx' }])
  Team: Team;

  @Column({
    type: 'varchar',
    length: 50,
  })
  PlayerName: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Country: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Position: string;

  @Column({
    type: 'int',
  })
  BackNumber: number;
}

```

<br>

PlayerService

```typescript
@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>
  ) {}

  async getAllPlayers() {
    return await this.playerRepository.find();
  }
}
```

<br>

쿼리 결과

```sql
SELECT 
	`Player`.`Idx` AS `Player_Idx`, 
	`Player`.`PlayerName` AS `Player_PlayerName`, 
	`Player`.`Country` AS `Player_Country`, 
	`Player`.`Position` AS `Player_Position`, 
	`Player`.`BackNumber` AS `Player_BackNumber` 
FROM 
	`player` `Player`
```

<br>

#### 양방향 eager: true 속성은 안 된다

```
TypeORMError: Circular eager relations are disallowed. Player#Team contains "eager: true", and 
its inverse side Team#Players contains "eager: true" as well. Remove "eager: true" from one side of the relation.
```

조회할 기준 엔티티에만 eager: true 를 설정해야 한다.

양방향으로 eager: true 를 설정하면 순환 참조 에러가 발생해서 아예 서버를 실행할 수 없다.

<br>

#### eager loading 시 find 메소드는 연관 관계에 있는 엔티티에 접근해도 N + 1 은 발생하지 않는다

Team 엔티티를 eager: true 로 설정하고 조회한 결과에서 연관 관계인 Player 엔티티에 접근해도 N + 1 은 발생하지 않는다.

<br>

Team 엔티티

```typescript
@Entity('team')
export class Team {
  @PrimaryGeneratedColumn()
  Idx: number;

  @OneToMany(() => Player, (player) => player.Team, {
    eager: true,
    // lazy: true,
  })
  // Players: Player[];
  Players: Promise<Player[]>;

  @Column({
    type: 'varchar',
    length: 50,
  })
  TeamName: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Country: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  League: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Region: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Stadium: string;
}
```

<br>

controller

```typescript
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async getAllTeams() {
    return await this.teamService.getAllTeams();
  }
}
```

<br>

service

```typescript
@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Team>,
  ) {}

  async getAllTeams(): Promise<Team[]> {
    const team: Team[] = await this.teamRepository.find();

    for (const t of team) {
      const player: Player[] = await t.Players;
    }

    return team;
  }
}

```

<br>

쿼리 결과

```sql
SELECT 
	`Team`.`Idx` AS `Team_Idx`, `Team`.`TeamName` AS `Team_TeamName`, 
	`Team`.`Country` AS `Team_Country`, `Team`.`League` AS `Team_League`, 
	`Team`.`Region` AS `Team_Region`, `Team`.`Stadium` AS `Team_Stadium`, 
	`Team_Players`.`Idx` AS `Team_Players_Idx`, 
	`Team_Players`.`PlayerName` AS `Team_Players_PlayerName`, 
	`Team_Players`.`Country` AS `Team_Players_Country`, 
	`Team_Players`.`Position` AS `Team_Players_Position`, 
	`Team_Players`.`BackNumber` AS `Team_Players_BackNumber` 
FROM 
	`team` `Team` 
LEFT JOIN 
	`player` `Team_Players` 
ON 
	`Team_Players`.`Idx`=`Team`.`Idx`
```

<br>

#### eager loading 시 find 메소드는 where in 조건으로 조회하고 연관 관계의 엔티티에 접근해도  N + 1 쿼리 발생하지 않는다

where in 조건으로 Team 엔티티를 조회하고 각 Team 별로 연관 관계의 Player 를 조회해도 N + 1 쿼리 발생하지 않는다.

<br>

Team 엔티티

```typescript
@Entity('team')
export class Team {
  @PrimaryGeneratedColumn()
  Idx: number;

  @OneToMany(() => Player, (player) => player.Team, {
    eager: true,
    // lazy: true,
  })
  // Players: Player[];
  Players: Promise<Player[]>;

  @Column({
    type: 'varchar',
    length: 50,
  })
  TeamName: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Country: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  League: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Region: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Stadium: string;
}
```

<br>

TeamController

```typescript
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async getTeams(): Promise<Team[]> {
    return await this.teamService.getTeams();
  }
}
```

<br>

TeamService

```typescript
@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Team>,
  ) {}

  async getTeams(): Promise<Team[]> {
    const team: Team[] = await this.teamRepository.find({
      where: {
        Idx: In([1, 2]),
      }
    })

    for (const t of team) {
      const player: Player[] = await t.Players;
    }

    return team;
  }
}
```

<br>

쿼리 결과

```sql
SELECT 
	`Team`.`Idx` AS `Team_Idx`, `Team`.
	`TeamName` AS `Team_TeamName`, 
	`Team`.`Country` AS `Team_Country`, 
	`Team`.`League` AS `Team_League`, 
	`Team`.`Region` AS `Team_Region`, 
	`Team`.`Stadium` AS `Team_Stadium`, 
	`Team_Players`.`Idx` AS `Team_Players_Idx`, 
	`Team_Players`.`PlayerName` AS `Team_Players_PlayerName`, 
	`Team_Players`.`Country` AS `Team_Players_Country`, 
	`Team_Players`.`Position` AS `Team_Players_Position`, 
	`Team_Players`.`BackNumber` AS `Team_Players_BackNumber` 
FROM 
	`team` `Team` 
LEFT JOIN 
	`player` `Team_Players` 
ON 
	`Team_Players`.`Idx`=`Team`.`Idx` 
WHERE
	(`Team`.`Idx` IN (?, ?)) -- PARAMETERS: [1,2]
```

<br>

#### findOne 도 find 처럼 eager loading 시 연관 관계에 있는 엔티티에 접근하면 N + 1 쿼리는 발생하지 않는다. 그러나 distinct 쿼리가 발생한다.

Team 엔티티

```typescript
@Entity('team')
export class Team {
  @PrimaryGeneratedColumn()
  Idx: number;

  @OneToMany(() => Player, (player) => player.Team, {
    eager: true,
    // lazy: true,
  })
  // Players: Player[];
  Players: Promise<Player[]>;

  @Column({
    type: 'varchar',
    length: 50,
  })
  TeamName: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Country: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  League: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Region: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Stadium: string;
}
```

<br>

TeamController

```typescript
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @UsePipes(ParseIntPipe)
  async getTeam(
    @Query('id') id: number,
  ) {
    return await this.teamService.getTeam(id);
  }
}
```

<br>

TeamService

```typescript
@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Team>,
  ) {}

  async getTeam(id: number): Promise<Team> {
    const team: Team = await this.teamRepository.findOne({
      where: {
        Idx: id,
      }
    })

    const players: Player[] = await team.Players;

    return team;
  }
}

```

<br>

쿼리 결과

처음에는 N + 1 쿼리라고 생각했으나 자세히보니 N + 1 쿼리는 아니었다. 

Player 는 이미 첫번째 쿼리에서 left join 으로 조회가 되고 있다.

``` sql
-- 첫번째 쿼리문의 FROM 절에 사용된 쿼리문이 두번째 쿼리문으로 다시 사용된다
query: SELECT DISTINCT `distinctAlias`.`Team_Idx` AS `ids_Team_Idx` FROM (SELECT `Team`.`Idx` AS `Team_Idx`, `Team`.`TeamName` AS `Team_TeamName`, `Team`.`Country` AS `Team_Country`, `Team`.`League` AS `Team_League`, `Team`.`Region` AS `Team_Region`, `Team`.`Stadium` AS `Team_Stadium`, `Team_Players`.`Idx` AS `Team_Players_Idx`, `Team_Players`.`PlayerName` AS `Team_Players_PlayerName`, `Team_Players`.`Country` AS `Team_Players_Country`, `Team_Players`.`Position` AS `Team_Players_Position`, `Team_Players`.`BackNumber` AS `Team_Players_BackNumber` FROM `team` `Team` LEFT JOIN `player` `Team_Players` ON `Team_Players`.`Idx`=`Team`.`Idx` WHERE (`Team`.`Idx` = ?)) `distinctAlias` ORDER BY `Team_Idx` ASC LIMIT 1 -- PARAMETERS: [1]

-- 첫번째 쿼리문에서 ORDER BY, LIMIT 수행한 후에 두번째 쿼리문에서는 IN 사용한다
query: SELECT `Team`.`Idx` AS `Team_Idx`, `Team`.`TeamName` AS `Team_TeamName`, `Team`.`Country` AS `Team_Country`, `Team`.`League` AS `Team_League`, `Team`.`Region` AS `Team_Region`, `Team`.`Stadium` AS `Team_Stadium`, `Team_Players`.`Idx` AS `Team_Players_Idx`, `Team_Players`.`PlayerName` AS `Team_Players_PlayerName`, `Team_Players`.`Country` AS `Team_Players_Country`, `Team_Players`.`Position` AS `Team_Players_Position`, `Team_Players`.`BackNumber` AS `Team_Players_BackNumber` FROM `team` `Team` LEFT JOIN `player` `Team_Players` ON `Team_Players`.`Idx`=`Team`.`Idx` WHERE ( (`Team`.`Idx` = ?) ) AND ( `Team`.`Idx` IN (1) ) -- PARAMETERS: [1]
```

<br>

#### findOne select distinct

> [that's like pre-select query. typeorm does this because JOINs may cause multiple rows be returned for a single row in the original entity table, making it impossible to properly apply LIMIT. typeorm selects distinct ids applying limits to ids only, and then second (real select) applies WHERE id IN instead of LIMIT, so that you get both JOINs and LIMIT working properly at the same time.](https://github.com/typeorm/typeorm/issues/4998)

findOne 에 where 조건을 걸면 한번으로 조회될 것이라 예상과는 달리 두번의 쿼리가 발생한다. N + 1 쿼리는 아니고 distinct 쿼리가 발생한다. 

첫번째 쿼리문의 FROM 절에 사용된 쿼리문이 두번째 쿼리문에 다시 사용된다. join 이 있을 때 나타나는 현상으로 ORDER BY, LIMIT 을 통해 사전 select 를 한 후에 이후 쿼리에서 IN 으로 select 한다.

<br>

"join may cause multiple rows be returned for a single row in the original entity table" 문구를 보면 DB 테이블에 단일 행으로 저장된 데이터가 orm 으로 join 을 거치면 여러 행으로 결과가 나올 수 있다고 한다. 이 의미는 [이글](https://devroach.tistory.com/115) 에서 언급하는 distinct 를 하기 전의 객체의 중복과 관련 있는 내용이라 생각한다. 

DB 에서 1:N 관계 테이블에 대해 inner join, left join 등을 수행하면 1:N 의 1에 해당하는 테이블의 내용은 동일한 내용이 여러번 나올 수 있다. 

예를 들어 Team, Player 테이블이 1:N 관계고 Team 테이블에 (idx: 1, name: 'manchester united') 데이터 1개가 있고, Player 테이블에 (idx: 1, teamIdx: 1), (idx: 2, teamIdx: 1) 데이터 2개가 있다고 가정해보겠다.

이때 Team과 Player 테이블을 left join 으로 조건을 Team 테이블의 Idx 가 1인 경우를 두면 동일한 Team 객체가 2개가 반환될 수 있다. DB 에서는 당연한 얘기지만 ORM 에서는 객체를 다루기 때문에 객체의 중복을 막기 위해 distinct 를 사용할 수 있다.

TypeORM 에서는 이런 현상을 막기 위해 두번의 select 를 통해 막고 있어서 직접 확인할 수는 없지만 한번의 쿼리로 수행하기 위해서는 Query Builder 를 사용해야 한다. relations 옵션으로는 해결할 수 없다.

<br>

### 3. lazy loading

find, findOne 모두 N + 1 쿼리 발생한다.

<br>

#### 3-1. N + 1 쿼리 - 1

Team 엔티티에 lazy: true 설정했다.

```typescript
@Entity('team')
export class Team {
  @PrimaryGeneratedColumn()
  Idx: number;

  @OneToMany(() => Player, (player) => player.Team, {
    // eager: true,
    lazy: true,
  })
  // Players: Player[];
  Players: Promise<Player[]>;

  @Column({
    type: 'varchar',
    length: 50,
  })
  TeamName: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Country: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  League: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Region: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Stadium: string;
}
```

<br>

##### 3-1-1. Team 전체 조회시

TeamController

```typescript
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async getAllTeams() {
    return await this.teamService.getAllTeams();
  }
}
```

<br>

TeamService

```typescript
@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Team>,
  ) {}

  async getAllTeams(): Promise<Team[]> {
    const team: Team[] = await this.teamRepository.find();

    for (const t of team) {
      const player: Player[] = await t.Players;
    }

    return team;
  }
}
```

<br>

쿼리 결과

```sql
-- Team 조회
query: SELECT `Team`.`Idx` AS `Team_Idx`, `Team`.`TeamName` AS `Team_TeamName`, `Team`.`Country` AS `Team_Country`, `Team`.`League` AS `Team_League`, `Team`.`Region` AS `Team_Region`, `Team`.`Stadium` AS `Team_Stadium` FROM `team` `Team`

-- 여기서부터 N+1 쿼리 발생
-- Team 은 현재 DB에 총 2개 데이터가 있어서
-- Team 의 데이터 갯수만큼 2번의 추가 쿼리가 발생
query: SELECT `Players`.`Idx` AS `Players_Idx`, `Players`.`PlayerName` AS `Players_PlayerName`, `Players`.`Country` AS `Players_Country`, `Players`.`Position` AS `Players_Position`, `Players`.`BackNumber` AS `Players_BackNumber` FROM `player` `Players` WHERE `Players`.`Idx` IN (?) -- PARAMETERS: [1]

query: SELECT `Players`.`Idx` AS `Players_Idx`, `Players`.`PlayerName` AS `Players_PlayerName`, `Players`.`Country` AS `Players_Country`, `Players`.`Position` AS `Players_Position`, `Players`.`BackNumber` AS `Players_BackNumber` FROM `player` `Players` WHERE `Players`.`Idx` IN (?) -- PARAMETERS: [2]
```



##### 3-1-2. 특정 Team 조회시

TeamController

```typescript
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @UsePipes(ParseIntPipe)
  async getTeam(
    @Query('id') id: number,
  ) {
    return await this.teamService.getTeam(id);
  }
}
```

<br>

TeamService

```typescript
@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Team>,
  ) {}

  async getTeam(id: number): Promise<Team> {
    const team: Team = await this.teamRepository.findOne({
      where: {
        Idx: id,
      }
    })

    await team.Players;

    return team;
  }
}
```

<br>

쿼리 결과

```sql
-- 조건에 맞는 Team 조회
query: SELECT `Team`.`Idx` AS `Team_Idx`, `Team`.`TeamName` AS `Team_TeamName`, `Team`.`Country` AS `Team_Country`, `Team`.`League` AS `Team_League`, `Team`.`Region` AS `Team_Region`, `Team`.`Stadium` AS `Team_Stadium` FROM `team` `Team` WHERE (`Team`.`Idx` = ?) LIMIT 1 -- PARAMETERS: [1]

-- 조회된 Team 의 갯수인 1개 만큼 추가 쿼리 발생
query: SELECT `Players`.`Idx` AS `Players_Idx`, `Players`.`PlayerName` AS `Players_PlayerName`, `Players`.`Country` AS `Players_Country`, `Players`.`Position` AS `Players_Position`, `Players`.`BackNumber` AS `Players_BackNumber` FROM `player` `Players` WHERE `Players`.`Idx` IN (?) -- PARAMETERS: [1]
```

<br>

#### 3-2. N + 1 쿼리 - 2

Player 엔티티에 lazy: true 설정했다.

Team 엔티티의 경우와 마찬가지로 Player 엔티티를 조회할때도 find, findOne 모두 N + 1 쿼리 발생한다.

<br>

##### 3-2-1. 전체 Player 조회시

PlayerController

```typescript
@Controller('player')
export class PlayerController {
  constructor(
    private readonly playerService: PlayerService,
  ) {}

  @Get()
  async getAllPlayers() {
    return await this.playerService.getAllPlayers();
  }
}
```

<br>

PlayerService

```typescript
@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async getAllPlayers(): Promise<Player[]> {
    const players: Player[] = await this.playerRepository.find();

    for (const p of players) {
      await p.Team;
    }

    return players;
  }
}
```



<br>

쿼리 결과

```sql
query: SELECT `Player`.`Idx` AS `Player_Idx`, `Player`.`PlayerName` AS `Player_PlayerName`, `Player`.`Country` AS `Player_Country`, `Player`.`Position` AS `Player_Position`, `Player`.`BackNumber` AS `Player_BackNumber` FROM `player` `Player`

query: SELECT `Team`.`Idx` AS `Team_Idx`, `Team`.`TeamName` AS `Team_TeamName`, `Team`.`Country` AS `Team_Country`, `Team`.`League` AS `Team_League`, `Team`.`Region` AS `Team_Region`, `Team`.`Stadium` AS `Team_Stadium` FROM `team` `Team` INNER JOIN `player` `Player` ON `Player`.`Idx` = `Team`.`Idx` WHERE `Player`.`Idx` IN (?) -- PARAMETERS: [1]

query: SELECT `Team`.`Idx` AS `Team_Idx`, `Team`.`TeamName` AS `Team_TeamName`, `Team`.`Country` AS `Team_Country`, `Team`.`League` AS `Team_League`, `Team`.`Region` AS `Team_Region`, `Team`.`Stadium` AS `Team_Stadium` FROM `team` `Team` INNER JOIN `player` `Player` ON `Player`.`Idx` = `Team`.`Idx` WHERE `Player`.`Idx` IN (?) -- PARAMETERS: [2]

query: SELECT `Team`.`Idx` AS `Team_Idx`, `Team`.`TeamName` AS `Team_TeamName`, `Team`.`Country` AS `Team_Country`, `Team`.`League` AS `Team_League`, `Team`.`Region` AS `Team_Region`, `Team`.`Stadium` AS `Team_Stadium` FROM `team` `Team` INNER JOIN `player` `Player` ON `Player`.`Idx` = `Team`.`Idx` WHERE `Player`.`Idx` IN (?) -- PARAMETERS: [3]

query: SELECT `Team`.`Idx` AS `Team_Idx`, `Team`.`TeamName` AS `Team_TeamName`, `Team`.`Country` AS `Team_Country`, `Team`.`League` AS `Team_League`, `Team`.`Region` AS `Team_Region`, `Team`.`Stadium` AS `Team_Stadium` FROM `team` `Team` INNER JOIN `player` `Player` ON `Player`.`Idx` = `Team`.`Idx` WHERE `Player`.`Idx` IN (?) -- PARAMETERS: [4]

query: SELECT `Team`.`Idx` AS `Team_Idx`, `Team`.`TeamName` AS `Team_TeamName`, `Team`.`Country` AS `Team_Country`, `Team`.`League` AS `Team_League`, `Team`.`Region` AS `Team_Region`, `Team`.`Stadium` AS `Team_Stadium` FROM `team` `Team` INNER JOIN `player` `Player` ON `Player`.`Idx` = `Team`.`Idx` WHERE `Player`.`Idx` IN (?) -- PARAMETERS: [5]
```

<br>

##### 3-2-2. 특정 player 조회시

PlayerController

```typescript
@Controller('player')
export class PlayerController {
  constructor(
    private readonly playerService: PlayerService,
  ) {}

  @Get()
  @UsePipes(ParseIntPipe)
  async getPlayer(
    @Query('id') id: number,
  ) {
    return await this.playerService.getPlayer(id);
  }
}
```



<br>

PlayerService

```typescript
@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async getPlayer(id: number): Promise<Player> {
    const player: Player = await this.playerRepository.findOne({
      where: {
        Idx: id,
      },
    });

    await player.Team;

    return player;
  }
}
```

<br>

쿼리 결과

```sql
query: SELECT `Player`.`Idx` AS `Player_Idx`, `Player`.`PlayerName` AS `Player_PlayerName`, `Player`.`Country` AS `Player_Country`, `Player`.`Position` AS `Player_Position`, `Player`.`BackNumber` AS `Player_BackNumber` FROM `player` `Player` WHERE (`Player`.`Idx` = ?) LIMIT 1 -- PARAMETERS: [1]

query: SELECT `Team`.`Idx` AS `Team_Idx`, `Team`.`TeamName` AS `Team_TeamName`, `Team`.`Country` AS `Team_Country`, `Team`.`League` AS `Team_League`, `Team`.`Region` AS `Team_Region`, `Team`.`Stadium` AS `Team_Stadium` FROM `team` `Team` INNER JOIN `player` `Player` ON `Player`.`Idx` = `Team`.`Idx` WHERE `Player`.`Idx` IN (?) -- PARAMETERS: [1]
```

<br>

#### 3-3. N + 1 쿼리 해결

##### 3-3-1. leftJoinAndSelect

query builder 의 leftJoinAndSelect 를 이용해서 N + 1 쿼리가 발생하지 않도록 할 수 있다.

<br>

Team 엔티티

```typescript
@Entity('team')
export class Team {
  @PrimaryGeneratedColumn()
  Idx: number;

  @OneToMany(() => Player, (player) => player.Team, {
    // eager: true,
    lazy: true,
  })
  // Players: Player[];
  Players: Promise<Player[]>;

  @Column({
    type: 'varchar',
    length: 50,
  })
  TeamName: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Country: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  League: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Region: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Stadium: string;
}
```

<br>

TeamController

```typescript
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @UsePipes(ParseIntPipe)
  async getTeam(
    @Query('id') id: number,
  ): Promise<Team> {
    return await this.teamService.getTeam(id);
  }
}
```

<br>

TeamService

```typescript
@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Team>,
  ) {}

  async getTeam(id: number): Promise<Team> {
    const team: Team = await this.teamRepository
      .createQueryBuilder('Team')
      // .leftJoinAndSelect(Player, 'player', 'team.Idx = player.idx')
      // 위와 같이 작성하면 N + 1 쿼리 발생한다
      // https://typeorm.io/select-query-builder#joining-relations
      .leftJoinAndSelect('Team.Players', 'Player')
      .where('Team.Idx = :id', {id: id})
      .getOne();

    const players: Player[] = await team.Players;

    return team;
  }
}
```

<br>

쿼리 결과

```sql
-- N + 1 쿼리가 발생하지 않는다
SELECT 
	`Team`.`Idx` AS `Team_Idx`, 
	`Team`.`TeamName` AS `Team_TeamName`, 
	`Team`.`Country` AS `Team_Country`, 
	`Team`.`League` AS `Team_League`, 
	`Team`.`Region` AS `Team_Region`, 
	`Team`.`Stadium` AS `Team_Stadium`, 
	`Player`.`Idx` AS `Player_Idx`, 
	`Player`.`PlayerName` AS `Player_PlayerName`, 
	`Player`.`Country` AS `Player_Country`, 
	`Player`.`Position` AS `Player_Position`, 
	`Player`.`BackNumber` AS `Player_BackNumber`, 
	`Player`.`Team` AS `Player_Team` 
FROM 
	`team` `Team` 
LEFT JOIN 
	`player` `Player` 
ON 
	`Player`.`Team`=`Team`.`Idx` 
WHERE 
	`Team`.`Idx` = ? -- PARAMETERS: [1]
```

<br>

##### 3-3-2. relations 옵션  

find 메소드에 relations 옵션을 적용한다.

<br>

TeamController

```typescript
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async getTeams(): Promise<Team[]> {
    return await this.teamService.getTeams();
  }
}
```

<br>

TeamService

```typescript
@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Team>,
  ) {}

  async getTeams(): Promise<Team[]> {
    const team: Team[] = await this.teamRepository.find({
      relations: ['Players'],
    })

    for (const t of team) {
      const player: Player[] = await t.Players;
    }

    return team;
  }
}

```

<br>

findOne 메소드에 relations 옵션 적용시 distinct 쿼리가 발생한다.

TeamController

```typescript
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @UsePipes(ParseIntPipe)
  async getTeam(
    @Query('id') id: number,
  ): Promise<Team> {
    return await this.teamService.getTeam(id);
  }
}
```

<br>

TeamService

```typescript
@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Team>,
  ) {}

  async getTeam(id: number): Promise<Team> {
    const team: Team = await this.teamRepository.findOne({
      where: {
        Idx: id
      },
      relations: ['Players'],
    })
    
    const players: Player[] = await team.Players;

    return team;
  }
}
```

<br>

쿼리 결과

```sql
query: SELECT DISTINCT `distinctAlias`.`Team_Idx` AS `ids_Team_Idx` FROM (SELECT `Team`.`Idx` AS `Team_Idx`, `Team`.`TeamName` AS `Team_TeamName`, `Team`.`Country` AS `Team_Country`, `Team`.`League` AS `Team_League`, `Team`.`Region` AS `Team_Region`, `Team`.`Stadium` AS `Team_Stadium`, `Team__Team_Players`.`Idx` AS `Team__Team_Players_Idx`, `Team__Team_Players`.`PlayerName` AS `Team__Team_Players_PlayerName`, `Team__Team_Players`.`Country` 
AS `Team__Team_Players_Country`, `Team__Team_Players`.`Position` AS `Team__Team_Players_Position`, `Team__Team_Players`.`BackNumber` AS `Team__Team_Players_BackNumber`, `Team__Team_Players`.`Team` AS `Team__Team_Players_Team` FROM `team` `Team` LEFT JOIN `player` `Team__Team_Players` ON `Team__Team_Players`.`Team`=`Team`.`Idx` WHERE (`Team`.`Idx` = ?)) `distinctAlias` ORDER BY `Team_Idx` ASC LIMIT 1 -- PARAMETERS: [1]

query: SELECT `Team`.`Idx` AS `Team_Idx`, `Team`.`TeamName` AS `Team_TeamName`, `Team`.`Country` AS `Team_Country`, `Team`.`League` AS `Team_League`, `Team`.`Region` AS `Team_Region`, `Team`.`Stadium` AS `Team_Stadium`, `Team__Team_Players`.`Idx` AS `Team__Team_Players_Idx`, `Team__Team_Players`.`PlayerName` AS `Team__Team_Players_PlayerName`, `Team__Team_Players`.`Country` AS `Team__Team_Players_Country`, `Team__Team_Players`.`Position` AS `Team__Team_Players_Position`, `Team__Team_Players`.`BackNumber` AS `Team__Team_Players_BackNumber`, `Team__Team_Players`.`Team` AS `Team__Team_Players_Team` FROM `team` `Team` LEFT JOIN `player` `Team__Team_Players` ON `Team__Team_Players`.`Team`=`Team`.`Idx` WHERE ( (`Team`.`Idx` = ?) ) AND ( `Team`.`Idx` IN (1) ) -- PARAMETERS: [1]
```

<br>

위에서 언급한 distinct 쿼리가 추가적으로 발생했다. 이는 Query Builder 로 해결 가능하다.

```typescript
@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Team>,
  ) {}

  async getTeam(id: number): Promise<Team> {
    const team: Team = await this.teamRepository
      .createQueryBuilder('Team')
      .leftJoinAndSelect('Team.Players', 'Player')
      .where('Team.Idx = :id', {id: id})
      .getOne();
    const players: Player[] = await team.Players;
    return team;
  }
}

```

<br>

쿼리 결과

```sql
query: SELECT `Team`.`Idx` AS `Team_Idx`, `Team`.`TeamName` AS `Team_TeamName`, `Team`.`Country` AS `Team_Country`, `Team`.`League` AS `Team_League`, `Team`.`Region` AS `Team_Region`, `Team`.`Stadium` AS `Team_Stadium`, `Player`.`Idx` AS `Player_Idx`, `Player`.`PlayerName` AS `Player_PlayerName`, `Player`.`Country` AS `Player_Country`, `Player`.`Position` AS `Player_Position`, `Player`.`BackNumber` AS `Player_BackNumber`, `Player`.`Team` AS `Player_Team` FROM `team` `Team` LEFT JOIN 
`player` `Player` ON `Player`.`Team`=`Team`.`Idx` WHERE `Team`.`Idx` = ? -- PARAMETERS: [1]
```

<br>

### 4. JPA 의 MultipleBagFetchException 에러가 TypeORM 에서는 어떻게 나타날까?

JPA MultipleBagFetchException 에 대해서는 [향로](https://jojoldu.tistory.com/457) 님의 글에 자세히 설명되어 있다. 1:N 관계 중 N 의 관계에 있는 테이블이 2개 이상일때 N + 1 쿼리를 피하기 위해 1에서 N으로 (OneToMany 방향으로) fetch join 을 수행하면 MultipleBagFetchException 에러가 발생하는 현상이다. 이 경우에는 N에 해당하는 테이블이 1개까지만 가능한데 2개 이상을 조회하려고 해서 에러가 발생했다.

결론적으로 TypeORM 에서는 MultipleBagFetchException 과 같은 에러가 발생하지 않았다.

<br>

#### 4-1. Query Builder

1:N 관계로 1은 Team 엔티티, N은 Player, Coach 엔티티가 해당된다. query builder 를 통해 toMany 방향으로 lazy loading  을 수행해보았다.

<br>

Team 엔티티

```typescript
@Entity('team')
export class Team {
  @PrimaryGeneratedColumn()
  Idx: number;

  @OneToMany(() => Player, (player) => player.Team, {
    // eager: true,
    lazy: true,
  })
  // Players: Player[];
  Players: Promise<Player[]>;

  @OneToMany(() => Coach, (coach) => coach.Team, {
    // eager: true,
    lazy: true,
  })
  Coach: Promise<Coach[]>;

  @Column({
    type: 'varchar',
    length: 50,
  })
  TeamName: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Country: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  League: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Region: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Stadium: string;
}
```

<br>

Coach 엔티티

```typescript
@Entity('coach')
export class Coach {
  @PrimaryGeneratedColumn()
  Idx: number;

  @ManyToOne(() => Team, (team) => team.Coach, {
    lazy: true,
  })
  // https://tristy.tistory.com/36
  // @JoinColumn([{ name: 'Idx' }])
  // join column 을 잘못 설정했다
  // DB 에서 player table 의 외래키로 사용하는 컬럼은 Team 이다
  // Idx 컬럼은 Player 테이블의 AUTO_INCREMENT 되는 PRIMARY KEY 다
  // @JoinColumn([{ name: 'Team', referencedColumnName: 'Idx' }])
  @JoinColumn([{ name: 'Team'}])
  Team: Promise<Team>;

  @Column({
    type: 'varchar',
    length: 50,
  })
  CoachName: string;
}
```

<br>

TeamController

```typescript
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async getTeams(): Promise<Team[]> {
    return await this.teamService.getTeams();
  }
}

```

<br>

TeamService

```typescript
@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Team>,
  ) {}

  async getTeams(): Promise<Team[]> {
    const team: Team[] = await this.teamRepository
      .createQueryBuilder('Team')
      .leftJoinAndSelect('Team.Players', 'Player')
      .leftJoinAndSelect('Team.Coach', 'Coach')
      .getMany();

    for (const t of team) {
      const player: Player[] = await t.Players;
      const coach: Coach[] = await t.Coach;
    }
    
    return team;
  }
}

```

<br>

쿼리 결과

```sql
query: 
SELECT
	`Team`.`Idx` AS `Team_Idx`, 
	`Team`.`TeamName` AS `Team_TeamName`, 
	`Team`.`Country` AS `Team_Country`, 
	`Team`.`League` AS `Team_League`, 
	`Team`.`Region` AS `Team_Region`, 
	`Team`.`Stadium` AS `Team_Stadium`, 
	`Player`.`Idx` AS `Player_Idx`, 
	`Player`.`PlayerName` AS `Player_PlayerName`, 
	`Player`.`Country` AS `Player_Country`, 
	`Player`.`Position` AS `Player_Position`, 
	`Player`.`BackNumber` AS `Player_BackNumber`, 
	`Player`.`Team` AS `Player_Team`, 
	`Coach`.`Idx` AS `Coach_Idx`, 
	`Coach`.`CoachName` AS `Coach_CoachName`, 
	`Coach`.`Team` AS `Coach_Team` 
FROM 
	`team` `Team` 
LEFT JOIN 
	`player` `Player` 
ON 
	`Player`.`Team`=`Team`.`Idx`  
LEFT JOIN 
	`coach` `Coach`
ON 
	`Coach`.`Team`=`Team`.`Idx`
```

<br>

#### 4-2. relations

이번에는 query builder 대신에 relations 옵션을 적용해보았다.

<br>

쿼리 결과

```sql
query: 
SELECT 
    `Team`.`Idx` AS `Team_Idx`, 
    `Team`.`TeamName` AS `Team_TeamName`, 
    `Team`.`Country` AS `Team_Country`, 
    `Team`.`League` AS `Team_League`, 
    `Team`.`Region` AS `Team_Region`, 
    `Team`.`Stadium` AS `Team_Stadium`, 
    `Team__Team_Players`.`Idx` AS `Team__Team_Players_Idx`,
    `Team__Team_Players`.`PlayerName` AS `Team__Team_Players_PlayerName`, 
    `Team__Team_Players`.`Country` AS `Team__Team_Players_Country`, 
    `Team__Team_Players`.`Position` AS `Team__Team_Players_Position`, 
    `Team__Team_Players`.`BackNumber` AS `Team__Team_Players_BackNumber`,
    `Team__Team_Players`.`Team` AS `Team__Team_Players_Team`, 
    `Team__Team_Coach`.`Idx` AS `Team__Team_Coach_Idx`,
    `Team__Team_Coach`.`CoachName` AS `Team__Team_Coach_CoachName`, 
    `Team__Team_Coach`.`Team` AS `Team__Team_Coach_Team` 
FROM 
	`team` `Team` 
LEFT JOIN 
	`player` `Team__Team_Players` 
ON 
	`Team__Team_Players`.`Team`=`Team`.`Idx` 
LEFT JOIN 
	`coach` `Team__Team_Coach`
ON 
	`Team__Team_Coach`.`Team`=`Team`.`Idx`
```



<br>

<참고>

https://www.youtube.com/watch?v=brE0tYOV9jQ

https://www.youtube.com/watch?v=hsSc5epPXDs

'자바 ORM 표준 JPA 프로그래밍' (김영한)

https://typeorm.io/many-to-one-one-to-many-relations

https://onejunu.tistory.com/35

https://ryan-han.com/post/translated/pathvariable_queryparam/

https://devroach.tistory.com/115

https://hou27.tistory.com/entry/TypeORM-select-distinct-%EC%9D%B4%EC%8A%88

https://github.com/typeorm/typeorm/issues/4998

https://jojoldu.tistory.com/457