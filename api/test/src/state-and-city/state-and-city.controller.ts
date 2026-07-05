import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { StateAndCityService } from './state-and-city.service';
import { CreateStateAndCityDto } from './dto/create-state-and-city.dto';
import { UpdateStateAndCityDto } from './dto/update-state-and-city.dto';
import { PermissionGuard } from 'src/guard/permission.guard';

@Controller('state-and-city')
export class StateAndCityController {
  constructor(private readonly stateAndCityService: StateAndCityService) { }

  @Post()
  // @UseGuards(PermissionGuard)
  async create(@Body() createStateAndCityDto: CreateStateAndCityDto) {
    return this.stateAndCityService.create(createStateAndCityDto);
  }

  @Get()
  async findAll() {
    return this.stateAndCityService.findAll();
  }

  @Post(':id/cities/:cityName/add-zipcode')
  @UseGuards(PermissionGuard)
  async addZipCode(
    @Param('id') id: string,
    @Param('cityName') cityName: string,
    @Body('zipCode') zipCode: string,
  ) {
    return this.stateAndCityService.addZipCode(id, cityName, zipCode);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.stateAndCityService.findOne(id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  async update(
    @Param('id') id: string,
    @Body() updateStateAndCityDto: UpdateStateAndCityDto,
  ) {
    return this.stateAndCityService.update(id, updateStateAndCityDto);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  async remove(@Param('id') id: string) {
    return this.stateAndCityService.remove(id);
  }
}
