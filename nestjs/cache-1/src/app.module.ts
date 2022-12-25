import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as redisStore from 'cache-manager-ioredis';
import type { ClientOpts } from 'redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fake } from './entity/fake.entity';

@Module({
  imports: [
    // https://docs.nestjs.com/techniques/caching#different-stores
    CacheModule.register<ClientOpts>({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: +configService.get<string>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_DATABASE'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Fake]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
