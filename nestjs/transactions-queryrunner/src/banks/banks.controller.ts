import {
  Body,
  Controller,
  Post,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BanksService } from './banks.service';
import { HttpExceptionFilter } from './common/exceptions/http.exception';
import { SendMoneyDTO } from './dto/send-money.dto';

@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Post('sendMoney')
  @UsePipes(new ValidationPipe())
  @UseFilters(HttpExceptionFilter)
  async sendMoney(@Body() data: SendMoneyDTO) {
    return this.banksService.sendMoney(data);
  }
}
