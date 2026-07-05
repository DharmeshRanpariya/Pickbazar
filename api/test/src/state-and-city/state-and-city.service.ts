import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StateAndCity } from './entities/state-and-city.entity';
import { CreateStateAndCityDto } from './dto/create-state-and-city.dto';
import { UpdateStateAndCityDto } from './dto/update-state-and-city.dto';
import { join } from 'path';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';

@Injectable()
export class StateAndCityService {
  constructor(
    @InjectModel(StateAndCity.name)
    private stateAndCityModel: Model<StateAndCity>,
  ) {}

  async create(createStateAndCityDto: CreateStateAndCityDto): Promise<StateAndCity> {
    const createdStateAndCity = new this.stateAndCityModel(createStateAndCityDto);
    const stateAndCity = await createdStateAndCity.save();


    return stateAndCity;
  }

  async findAll(): Promise<StateAndCity[]> {

    let stateAndCities: StateAndCity[] = [];

    if (stateAndCities.length === 0) {
      stateAndCities = await this.stateAndCityModel.find().exec();
    }

    return stateAndCities;
  }

  async addZipCode(stateId: string, cityName: string, zipCode: string): Promise<StateAndCity> {
    const stateAndCity = await this.stateAndCityModel.findById(stateId).exec();

    if (!stateAndCity) {
      throw new NotFoundException(`State with ID ${stateId} not found`);
    }

    const updatedStateAndCity = await this.stateAndCityModel
      .findByIdAndUpdate(
        stateId,
        { $push: { [`cities.${cityName}`]: zipCode } },
        { new: true },
      )
      .exec();

    if (!updatedStateAndCity) {
      throw new NotFoundException(`City with name ${cityName} not found`);
    }

    return updatedStateAndCity;
  }

  async findOne(id: string): Promise<StateAndCity> {
    const stateAndCity = await this.stateAndCityModel.findById(id).exec();
    if (!stateAndCity) {
      throw new NotFoundException(`State with ID ${id} not found`);
    }
    return stateAndCity;
  }

  async update(id: string, updateStateAndCityDto: UpdateStateAndCityDto): Promise<StateAndCity> {
    const existingStateAndCity = await this.stateAndCityModel
      .findByIdAndUpdate(id, updateStateAndCityDto, { new: true })
      .exec();

    if (!existingStateAndCity) {
      throw new NotFoundException(`State with ID ${id} not found`);
    }

    return existingStateAndCity;
  }

  async remove(id: string): Promise<StateAndCity> {
    const deletedStateAndCity = await this.stateAndCityModel.findByIdAndDelete(id).exec();
    if (!deletedStateAndCity) {
      throw new NotFoundException(`State with ID ${id} not found`);
    }

    return deletedStateAndCity;
  }
}
