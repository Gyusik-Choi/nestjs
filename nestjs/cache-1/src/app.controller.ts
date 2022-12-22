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
