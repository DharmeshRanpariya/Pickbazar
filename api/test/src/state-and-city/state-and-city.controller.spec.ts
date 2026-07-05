import { Test, TestingModule } from '@nestjs/testing';
import { StateAndCityController } from './state-and-city.controller';
import { StateAndCityService } from './state-and-city.service';

describe('StateAndCityController', () => {
  let controller: StateAndCityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StateAndCityController],
      providers: [StateAndCityService],
    }).compile();

    controller = module.get<StateAndCityController>(StateAndCityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
