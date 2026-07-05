import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { Attribute } from './entities/attribute.entity';

@Injectable()
export class AttributesService {
  constructor(
    @InjectModel(Attribute.name)
    private readonly attributeModel: Model<Attribute>,
  ) {}

  async create(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
    const createdAttribute = new this.attributeModel(createAttributeDto);
    return createdAttribute.save();
  }

  async findAll(): Promise<Attribute[]> {
    return this.attributeModel.find().exec();
  }

  async findOne(id: string): Promise<Attribute> {
    return this.attributeModel.findById(id).exec();
  }

  async update(
    id: string,
    updateAttributeDto: UpdateAttributeDto,
  ): Promise<Attribute> {
    return this.attributeModel
      .findByIdAndUpdate(id, updateAttributeDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Attribute> {
    return this.attributeModel.findByIdAndDelete(id).exec();
  }
}
