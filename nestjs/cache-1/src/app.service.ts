import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, Repository } from 'typeorm';
import { Fake } from './entity/fake.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    @InjectRepository(Fake)
    private readonly fakeRepository: Repository<Fake>,

    private readonly dataSource: DataSource,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getCache(): Promise<Fake[]> {
    const start: number = new Date().getTime();

    const cachedFake = await this.cacheManager.get<Fake[]>('fake');

    if (cachedFake) {
      // https://codechacha.com/ko/javascript-get-timestamp/
      const cacheEnd: number = new Date().getTime();
      console.log('cached');
      console.log(cacheEnd - start);
      return cachedFake;
    }

    const fake: Fake[] = await this.fakeRepository.find({
      where: {
        id: Between(40000, 40100),
      },
    });

    const dbEnd = new Date().getTime();
    console.log('no cached');
    console.log(dbEnd - start);

    await this.cacheManager.set<Fake[]>('fake', fake);

    return fake;
  }

  async bulkInsert() {
    const fakeItems: Fake[] = [];

    for (let i = 1; i <= 50000; i++) {
      const fake: Fake = {
        id: null,
        name: 'name' + i.toString(),
      };

      fakeItems.push(fake);
    }

    // https://typeorm.io/insert-query-builder
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Fake)
      .values(fakeItems)
      .execute();
  }
}
