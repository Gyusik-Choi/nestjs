import { Controller, Get } from '@nestjs/common';
import { AcademyService } from './academy.service';

@Controller('academy')
export class AcademyController {
  constructor(private readonly academyService: AcademyService) {}

  @Get('academies')
  async getAllAcademies() {
    return this.academyService.getAllAcademies();
  }
}
