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

  findAllUsers(): Promise<UserAccount[]> {
    return this.usersRepository.find();
  }

  async findUser(userId: number): Promise<UserAccount> {
    return this.usersRepository.findOne({ id: userId });
  }

  createUser(userData: CreateUserDTO) {
    return this.usersRepository.save(userData);
  }
}
