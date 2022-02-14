import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { UserAccount } from './users/user.entity';

@Module({
  imports: [
    // https://stackoverflow.com/questions/60226370/certificate-error-when-connecting-to-sql-server

    // production 에서는 synchronize 옵션을 절대 쓰면 안된다
    // migration을 해야함
    TypeOrmModule.forRoot(),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
