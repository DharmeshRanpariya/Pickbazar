import { Test, TestingModule } from '@nestjs/testing';
import { StateAndCityService } from './state-and-city.service';

describe('StateAndCityService', () => {
  let service: StateAndCityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StateAndCityService],
    }).compile();

    service = module.get<StateAndCityService>(StateAndCityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
