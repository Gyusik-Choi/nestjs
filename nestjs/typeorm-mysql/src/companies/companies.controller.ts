import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDTO } from './dto/create-company.dto';
import { Company } from './entities/company.entity';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  findAllCompanies(): Promise<Company[]> {
    return this.companiesService.findAllCompanies();
  }

  @Post()
  createCompany(@Body() companyData: CreateCompanyDTO) {
    return this.companiesService.createCompany(companyData);
  }

  @Get(':founderId')
  getFounderOfCompany(@Param('founderId') founderId: number) {
    return this.companiesService.getCompaniesOfFounder(founderId);
  }
}
