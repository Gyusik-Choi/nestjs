import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserAccount } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserAccount)
    private readonly usersRepository: Repository<UserAccount>
  ) {}

  async findAllUsers(): Promise<UserAccount[]> {
    return await this.usersRepository.find();
  }

  async findUser(userId: number): Promise<UserAccount> {
    return await this.usersRepository.findOne({ id: userId });
  }

  async createUser(userData: CreateUserDTO) {
    return await this.usersRepository.save(userData);
  }
}
