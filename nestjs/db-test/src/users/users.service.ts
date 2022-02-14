import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from './user.entity';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserAccount)
    private usersRepository: Repository<UserAccount>,
  ) {}

  findAll(): Promise<UserAccount[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<UserAccount> {
    return this.usersRepository.findOne(id);
  }

  create(userData: CreateUserDTO) {
      return this.usersRepository.save(userData);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}