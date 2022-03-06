import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class TasksService {
  constructor(private readonly authService: AuthService) {}
  @Cron('0 30 1 * * *')
  async handleGetAllUsers() {
    await this.authService.getAllUsers();
  }
}
