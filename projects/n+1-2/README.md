# N + 1

### 연관관계 - 테이블 vs 객체

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

### eager loading

#### 조회할 엔티티에 eager: true 속성을 설정해야 한다.

Player 를 조회할때 eager: true 속성을 Player 엔티티에 설정하면 Team 엔티티의 내용까지 Left Join 으로 한번에 조회하면서 eager loading 이 적용된다.

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
FROM `player` `Player` 
LEFT JOIN `team` `Player_Team` ON `Player_Team`.`Idx`=`Player`.`Idx`
```

<br>

반면에 Player 엔티티가 아닌 Team 엔티티에 eager: true 를 설정하고 Player 를 조회하면 Team 을 조회하지 않는다. eager loading 이 적용되지 않았다.

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

```sql
SELECT 
	`Player`.`Idx` AS `Player_Idx`, 
	`Player`.`PlayerName` AS `Player_PlayerName`, 
	`Player`.`Country` AS `Player_Country`, 
	`Player`.`Position` AS `Player_Position`, 
	`Player`.`BackNumber` AS `Player_BackNumber` 
FROM `player` `Player`
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

### lazy loading

find, findOne 모두 N + 1 쿼리 발생한다.

<br>

#### N + 1 쿼리 - 1

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

##### 1. Team 전체 조회시

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
-- Team 조회
query: SELECT `Team`.`Idx` AS `Team_Idx`, `Team`.`TeamName` AS `Team_TeamName`, `Team`.`Country` AS `Team_Country`, `Team`.`League` AS `Team_League`, `Team`.`Region` AS `Team_Region`, `Team`.`Stadium` AS `Team_Stadium` FROM `team` `Team`

-- 여기서부터 N+1 쿼리 발생
-- Team 은 현재 DB에 총 2개 데이터가 있어서
-- Team 의 데이터 갯수만큼 2번의 추가 쿼리가 발생
query: SELECT `Players`.`Idx` AS `Players_Idx`, `Players`.`PlayerName` AS `Players_PlayerName`, `Players`.`Country` AS `Players_Country`, `Players`.`Position` AS `Players_Position`, `Players`.`BackNumber` AS `Players_BackNumber` FROM `player` `Players` WHERE `Players`.`Idx` IN (?) -- PARAMETERS: [1]

query: SELECT `Players`.`Idx` AS `Players_Idx`, `Players`.`PlayerName` AS `Players_PlayerName`, `Players`.`Country` AS `Players_Country`, `Players`.`Position` AS `Players_Position`, `Players`.`BackNumber` AS `Players_BackNumber` FROM `player` `Players` WHERE `Players`.`Idx` IN (?) -- PARAMETERS: [2]
```



##### 2. 특정 Team 조회시

controller

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

#### N + 1 쿼리 - 2

Player 엔티티에 lazy: true 설정했다.

Team 엔티티의 경우와 마찬가지로 Player 엔티티를 조회할때도 find, findOne 모두 N + 1 쿼리 발생한다.

<br>

##### 1. 전체 Player 조회시

controller

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

service

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

##### 2. 특정 player 조회시

controller

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

service

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

<참고>

https://www.youtube.com/watch?v=brE0tYOV9jQ

https://www.youtube.com/watch?v=hsSc5epPXDs

'자바 ORM 표준 JPA 프로그래밍' (김영한)

https://typeorm.io/many-to-one-one-to-many-relations

https://onejunu.tistory.com/35

