import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ResponseInterface } from './common/interfaces/response.interface';
import { SendMoneyDTO } from './dto/send-money.dto';
import { BankAccount } from './entities/bank-account.entity';

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,

    private readonly dataSource: DataSource,
  ) {}

  async sendMoney(data: SendMoneyDTO) {
    const { sender, receiver, money } = data;

    const findSender: ResponseInterface<BankAccount> = await this.findUser(
      sender,
    );

    const findReceiver: ResponseInterface<BankAccount> = await this.findUser(
      receiver,
    );

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findUser(sender: number): Promise<ResponseInterface<BankAccount>> {
    try {
      const user = await this.bankAccountRepository.findOne({
        where: {
          MemNo: sender,
        },
      });

      if (user === undefined) {
        throw new NotFoundException();
      }

      return {
        isError: false,
        message: '',
        statusCode: 200,
        data: user,
      };
    } catch (err) {
      // exception-filter로 처리
      throw new InternalServerErrorException(500, err);
    }
  }
}
