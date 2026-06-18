import { Controller, Get, Param } from '@nestjs/common';
import { FinancingApplicationsService } from './financing-applications.service';

@Controller('financing-applications')
export class FinancingApplicationsController {
    constructor(private readonly financingApplicationsService: FinancingApplicationsService) { }

    @Get()
    findAll() {
        return this.financingApplicationsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.financingApplicationsService.findOne(id);
    }

}
