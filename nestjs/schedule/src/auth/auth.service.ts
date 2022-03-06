import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from './entities/UserAccount.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
  ) {}

  async getAllUsers() {
    const users = await this.userAccountRepository.find();
    console.log(users);
    return users;
  }
}
