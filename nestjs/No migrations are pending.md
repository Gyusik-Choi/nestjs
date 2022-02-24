# No migrations are pending

NestJS + TypeORM 으로 migration을 통한 UserAccount 라는 db 테이블 생성을 시도했다.

package.json에 typeorm과 관련해서 CLI 명령어를 수행할 수 있도록 scripts에 추가했다.

```bash
  // package.json
  
  "scripts": {
    "typeorm": "node --require ts-node/register ./node_modules/typeorm/cli.js",
  }
```

<br>

migration 파일을 생성하기 위해 CreateUserTable 이라는 이름으로 migration 파일을 생성했다.

```bash
npm run typeorm migration:create -- -n CreateUserTable
```

<br>

생성한 파일에는 up, down 메소드로 나뉜 코드가 존재한다.

```tsx
import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUserTable1645674125196 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
        );
    }

}

```

<br>

migration을 진행할 내용을 up에 작성하면 되고, down은 up으로 진행한 내용을 되돌리기 위한 코드를 작성하면 된다.

```tsx
import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUserTable1645674125196 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                CREATE TABLE UserAccount
                (
                    id INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
                    firstName VARCHAR(50) NOT NULL,
                    lastName VARCHAR(50) NOT NULL,
                    isActive BIT DEFAULT 'TRUE'

                )
            `
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TABLE \`UserAccount\``
        );
    }

}
```

<br>

UserAccount 테이블을 생성하기 위한 코드를 up 메소드에 작성을 마치고 migration:run 명령어를 통해 db에 테이블이 생성하려고 했다.

```bash
npm run typeorm migration:run
```

<br>

그러나...

```bash
kuidoli@kuidoli MINGW64 ~/dev/node/nestjs/db-test (master)
$ npm run typeorm migration:run

> db-test@0.0.1 typeorm
> ts-node ./node_modules/typeorm/cli.js "migration:run"

query: SELECT SCHEMA_NAME() AS "schema_name"
query: SELECT * FROM "users"."INFORMATION_SCHEMA"."TABLES" WHERE "TABLE_NAME" = 'migrations' 
AND "TABLE_SCHEMA" = 'dbo'
query: SELECT * FROM "users".."migrations" "migrations" ORDER BY "id" DESC
No migrations are pending
```

<br>

no migrations are pending 이라는 문구가 맨 아래에 나왔고, UserAccount 테이블이 생성되지 않았다.

그리고 생성된 migrations 테이블에는 migration을 진행한 정보가 기록이 되야 하는데, 빈 테이블로 남아있다.

테이블을 생성하기 위해 구글링을 한참 했으나 잘 해결되지 않다가 직접적인 부분은 아니었으나 이전부터 경로와 관련된 내용들을 접해서 혹시나 하는 마음에 상대 경로로 변경을 했다.

<br>

변경 전

```bash
{
    "type": "mssql",
    "host": "",
    "port": ,
    "username": "",
    "password": "",
    "database": "users",
    "entities": ["dist/**/*.entity{.ts,.js}"],
    "extra": {
        "trustServerCertificate": true
    },
    "synchronize": false,
    "migrations": ["dist/migrations/*.js"],
    "cli": {
        "migrationsDir": "src/migrations"
    }
}
```

<br>

변경 후

```json
{
    "type": "mssql",
    "host": "",
    "port": ,
    "username": "",
    "password": "",
    "database": "users",
    "entities": ["./dist/**/*.entity{.ts,.js}"],
    "extra": {
        "trustServerCertificate": true
    },
    "synchronize": false,
    "migrations": ["./dist/migrations/*.js"],
    "cli": {
        "migrationsDir": "./src/migrations"
    }
}
```

<br>

경로 수정을 거친 후에 다시 migration:run 을 시도했고 성공적으로 테이블이 생성됐다.

```bash

kuidoli@kuidoli MINGW64 ~/dev/node/nestjs/db-test (master)
$ npm run typeorm migration:run

> db-test@0.0.1 typeorm
> node --require ts-node/register ./node_modules/typeorm/cli.js "migration:run"

query: SELECT SCHEMA_NAME() AS "schema_name"
query: SELECT * FROM "users"."INFORMATION_SCHEMA"."TABLES" WHERE "TABLE_NAME" = 'migrations' 
AND "TABLE_SCHEMA" = 'dbo'
query: SELECT * FROM "users".."migrations" "migrations" ORDER BY "id" DESC
0 migrations are already loaded in the database.
1 migrations were found in the source code.
1 migrations are new migrations that needs to be executed.
query: BEGIN TRANSACTION
query:
                CREATE TABLE UserAccount
                (
                    id INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
                    firstName VARCHAR(50) NOT NULL,
                    lastName VARCHAR(50) NOT NULL,
                    isActive BIT DEFAULT 'TRUE'

                )

query: INSERT INTO "users".."migrations"("timestamp", "name") VALUES (@0, @1) -- PARAMETERS: 
[{"value":1645674125196,"type":"bigint","params":[]},{"value":"CreateUserTable1645674125196","type":"varchar","params":[]}]
Migration CreateUserTable1645674125196 has been executed successfully.
query: COMMIT
```

<br>

migration으로 db에 테이블은 생성했으나 이에 대응되는 entity는 어떻게 생성하고 관리해줘야 하는지 아직 공부가 더 필요하다. 직접 entity를 생성하지 않고 자동으로 생성할 수 있다면 좋을 것 같다.

<br>

https://wikidocs.net/158618

https://darrengwon.tistory.com/1311

https://typeorm.io/#/using-cli

https://velog.io/@heumheum2/typeORM-Migration-%EC%9D%B4%EC%8A%88

https://github.com/typeorm/typeorm/issues/350

