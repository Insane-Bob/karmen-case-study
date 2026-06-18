import { Module } from '@nestjs/common';
import { FinancingApplicationsController } from './financing-applications.controller';
import { FinancingApplicationsService } from './financing-applications.service';

@Module({
  controllers: [FinancingApplicationsController],
  providers: [FinancingApplicationsService],
  exports: [FinancingApplicationsService],
})
export class FinancingApplicationsModule { }
