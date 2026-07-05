import { PartialType } from '@nestjs/swagger';
import { CreateStateAndCityDto } from './create-state-and-city.dto';

export class UpdateStateAndCityDto extends PartialType(CreateStateAndCityDto) {}
