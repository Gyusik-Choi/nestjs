import { IsNumber } from 'class-validator';

export class SendMoneyDTO {
  @IsNumber()
  sender: number;

  @IsNumber()
  receiver: number;

  @IsNumber()
  money: number;
}
