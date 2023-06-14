import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { TypeORMCustomModule } from '../common/modules/typeorm-custom.module';
import { BoardRepository } from '../repositories/board.repository';

@Module({
  imports: [
    TypeORMCustomModule.forCustomRepository([BoardRepository])
  ],
  controllers: [BoardController],
  providers: [BoardService]
})
export class BoardModule {}
