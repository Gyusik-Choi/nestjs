import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Fake } from './entity/fake.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // https://medium.com/zigbang/nestjs%EC%9D%98-module%EA%B3%BC-cachemodule%EC%9D%84-%ED%99%9C%EC%9A%A9%ED%95%9C-redis-%EC%97%B0%EB%8F%99-2166a771196
  @Get('/cache')
  async getCache(): Promise<Fake[]> {
    return await this.appService.getCache();
  }

  // @Post('/bulk_insert')
  // async bulkInsert() {
  //   return await this.appService.bulkInsert();
  // }
}
