import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { ResponseInterface } from './common/interfaces/response.interface';
import { SendMoneyDTO } from './dto/send-money.dto';
import { BankAccount } from './entities/bank-account.entity';

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,

    private readonly connection: Connection,
  ) {}

  async sendMoney(data: SendMoneyDTO) {
    const { sender, receiver, money } = data;

    const findSender: ResponseInterface<BankAccount> = await this.findUser(
      sender,
    );

    const senderBalance: number = findSender['data']['Balance'];
    const minusBalance: number = senderBalance - money;

    const findReceiver: ResponseInterface<BankAccount> = await this.findUser(
      receiver,
    );

    const receiverBalance: number = findReceiver['data']['Balance'];
    const plusBalance: number = receiverBalance + money;

    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    const bankAccountManager: Repository<BankAccount> =
      queryRunner.manager.getRepository(BankAccount);

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.changeBalance(bankAccountManager, sender, minusBalance);
      await this.changeBalance(bankAccountManager, receiver, plusBalance);
      await queryRunner.commitTransaction();
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
      // try 의 throw new NotFoundException() 을 처리
      if (err['response']['message'] == 'Not Found') {
        throw new NotFoundException('해당하는 사용자가 없습니다', '노 해당');
      }

      throw new InternalServerErrorException(500, err);
    }
  }

  async changeBalance(
    manager: Repository<BankAccount>,
    member: number,
    balance: number,
  ) {
    await manager.update(member, {
      Balance: balance,
    });
  }
}
