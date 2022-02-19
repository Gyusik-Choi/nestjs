import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserAccount } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAllUsers(): Promise<UserAccount[]> {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  findUser(@Param('id') userId: number): Promise<UserAccount> {
    return this.usersService.findUser(userId);
  }

  // MustBeEntityError: Cannot save, given value must be an entity, instead "undefined" is given.
  // 위와 같은 에러가 난다면 Post 안에서 @Body 데코레이터를 안 썼을 가능성이 있다
  // https://github.com/typeorm/typeorm/issues/6077
  @Post()
  createUser(@Body() userData: CreateUserDTO) {
    return this.usersService.createUser(userData);
  }
}
