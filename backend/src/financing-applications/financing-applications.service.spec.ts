import { Test, TestingModule } from '@nestjs/testing';
import { FinancingApplicationsService } from './financing-applications.service';

describe('FinancingApplicationsService', () => {
  let service: FinancingApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinancingApplicationsService],
    }).compile();

    service = module.get<FinancingApplicationsService>(FinancingApplicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
