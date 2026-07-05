import { Test, TestingModule } from '@nestjs/testing';
import { RefundReasonController } from './refund-reason.controller';
import { RefundReasonService } from './refund-reason.service';

describe('RefundReasonController', () => {
  let controller: RefundReasonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefundReasonController],
      providers: [RefundReasonService],
    }).compile();

    controller = module.get<RefundReasonController>(RefundReasonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
