import { IsObject } from 'class-validator';

export class RequestSession {
  @IsObject()
  Session: object;
}
