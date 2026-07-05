import { Test, TestingModule } from '@nestjs/testing';
import { RefundReasonService } from './refund-reason.service';

describe('RefundReasonService', () => {
  let service: RefundReasonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefundReasonService],
    }).compile();

    service = module.get<RefundReasonService>(RefundReasonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
