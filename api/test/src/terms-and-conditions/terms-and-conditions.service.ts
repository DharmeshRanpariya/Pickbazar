import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TermsAndCondition } from './entities/terms-and-condition.entity';
import { CreateTermsAndConditionDto } from './dto/create-terms-and-condition.dto';
import { UpdateTermsAndConditionDto } from './dto/update-terms-and-condition.dto';
import { join } from 'path';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';


@Injectable()
export class TermsAndConditionsService {

  constructor(
    @InjectModel(TermsAndCondition.name)
    private termsAndConditionModel: Model<TermsAndCondition>,
  ) { }

  async create(
    createTermsAndConditionDto: CreateTermsAndConditionDto,
  ): Promise<TermsAndCondition> {
    const newTermsAndCondition = new this.termsAndConditionModel(
      createTermsAndConditionDto,
    );
    const savedTermsAndCondition = await newTermsAndCondition.save();
    return savedTermsAndCondition;
  }

  async findAll(
    title: string,
    sortedBy: string,
    orderBy: 'asc' | 'desc',
  ): Promise<any> {
  
    const filterQuery: any = {};
    if (title) {
      filterQuery.title = { $regex: new RegExp(title, 'i') };
    }

    const sortOrder = orderBy === 'desc' ? -1 : 1;
    const sortQuery = {};
    if (sortedBy) {
      sortQuery[sortedBy] = sortOrder;
    } else {
      sortQuery['createdAt'] = sortOrder;
    }

    const termsAndConditions = await this.termsAndConditionModel
      .find(filterQuery)
      .sort(sortQuery)
      .exec();

    return { data: termsAndConditions };
  }

  async findOne(id: string): Promise<TermsAndCondition> {
    const termsAndCondition = await this.termsAndConditionModel
      .findById(id)
      .exec();
    if (!termsAndCondition) {
      throw new NotFoundException(
        `Terms and Condition with ID ${id} not found`,
      );
    }
    return termsAndCondition;
  }

  async update(
    id: string,
    updateTermsAndConditionDto: UpdateTermsAndConditionDto,
  ): Promise<TermsAndCondition> {
    const updatedTermsAndCondition = await this.termsAndConditionModel
      .findByIdAndUpdate(id, updateTermsAndConditionDto, { new: true })
      .exec();

    if (!updatedTermsAndCondition) {
      throw new NotFoundException(
        `Terms and Condition with ID ${id} not found`,
      );
    }

    return updatedTermsAndCondition;
  }

  async remove(id: string): Promise<TermsAndCondition> {
    const deletedTermsAndCondition = await this.termsAndConditionModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedTermsAndCondition) {
      throw new NotFoundException(
        `Terms and Condition with ID ${id} not found`,
      );
    }

    return deletedTermsAndCondition;
  }
}
