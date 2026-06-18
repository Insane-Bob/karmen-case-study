import { Test, TestingModule } from '@nestjs/testing';
import { FinancingApplicationsController } from './financing-applications.controller';

describe('FinancingApplicationsController', () => {
  let controller: FinancingApplicationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancingApplicationsController],
    }).compile();

    controller = module.get<FinancingApplicationsController>(FinancingApplicationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
