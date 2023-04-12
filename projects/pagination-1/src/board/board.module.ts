import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Board } from '../../src/entities/board.entity';
// 위처럼 상대 경로로 하면 Error: Cannot find module '../../src/entities/board.entity' 에러가 발생한다
// 왜냐면 dist 의 파일이 동작하기 때문에 js 파일에는 src 경로가 없기 때문에 entity 를 찾을 수 없다
//
// 상대 경로에서 board.module.js 의 entity 경로
// => const board_entity_1 = require("../../src/entities/board.entity");
// 절대 경로 에서 board.module.js 의 entity 경로
// => const board_entity_1 = require("../entities/board.entity");
//
import { Board } from 'src/entities/board.entity';
import { TypeORMCustomModule } from 'src/common/decorators/modules/typeorm-custom.module';
import { BoardRepository } from './board.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board]),
    TypeORMCustomModule.forCustomRepository([BoardRepository])
  ],
  controllers: [BoardController],
  providers: [BoardService]
})
export class BoardModule {}
