import { Test, TestingModule } from '@nestjs/testing';
import { TermsAndConditionsController } from './terms-and-conditions.controller';
import { TermsAndConditionsService } from './terms-and-conditions.service';

describe('TermsAndConditionsController', () => {
  let controller: TermsAndConditionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TermsAndConditionsController],
      providers: [TermsAndConditionsService],
    }).compile();

    controller = module.get<TermsAndConditionsController>(TermsAndConditionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
