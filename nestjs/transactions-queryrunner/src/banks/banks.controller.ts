import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BanksService } from './banks.service';
import { SendMoneyDTO } from './dto/send-money.dto';

@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Post('sendMoney')
  @UsePipes(new ValidationPipe())
  async sendMoney(@Body() data: SendMoneyDTO) {
    return this.banksService.sendMoney(data);
  }
}
