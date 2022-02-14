import { Controller, Get, Body, Post } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll(): Promise<any> {
      return this.usersService.findAll();
    }

    @Post()
    create(@Body() userData: CreateUserDTO) {
        return this.usersService.create(userData);
    }
}