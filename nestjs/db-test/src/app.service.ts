import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';

@Injectable()
export class AppService {
  async getHello(): Promise<any> {
    const entityManager = getManager();
    // const result = await entityManager.query('SELECT * FROM dbo.ACCOUNT');
    const result = await entityManager.query('user_info');
    return result;
  }
}
