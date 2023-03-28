import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm/dist';
import { Team } from 'src/entities/team.entity';
import { Player } from 'src/entities/player.entity';
import { Coach } from 'src/entities/coach.entity';

@Injectable()
export class DbConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: parseInt(this.configService.get<string>('DATABASE_PORT')),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_DATABASE'),
      // entities: ['dist/entities/*.entity{.ts,.js}'],
      // https://wanago.io/2022/07/11/api-with-nestjs-migrating-to-typeorm-0-3/
      // https://stackoverflow.com/questions/56693067/entity-metadata-for-roleusers-was-not-found
      entities: [Team, Player, Coach],
      logging: true,
    };
  }
}
