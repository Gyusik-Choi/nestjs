import { CACHE_MANAGER, Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { Cache } from 'cache-manager';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // https://medium.com/zigbang/nestjs%EC%9D%98-module%EA%B3%BC-cachemodule%EC%9D%84-%ED%99%9C%EC%9A%A9%ED%95%9C-redis-%EC%97%B0%EB%8F%99-2166a771196
  @Get('/cache')
  async getCache() {
    const cachedTime = await this.cacheManager.get<number>('time');

    if (cachedTime) {
      console.log(cachedTime);
      return 'cached time : ' + cachedTime;
    }

    const now = new Date();
    await this.cacheManager.set('time', now);
    return 'now : ' + now;
  }
}
