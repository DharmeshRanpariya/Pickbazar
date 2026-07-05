import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTypeDto } from './dto/create-type.dto';
import { Type, TypeDocument } from './entities/type.entity';
import { join } from 'path';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';

@Injectable()
export class TypeService {

  constructor(@InjectModel(Type.name) private typeModel: Model<TypeDocument>) {}

  async create(createTypeDto: CreateTypeDto): Promise<Type> {
    const newType = new this.typeModel(createTypeDto);
    const savedType = await newType.save();
    return savedType;
  }

  async findAll(): Promise<any> {

    const data = await this.typeModel.find().exec();

    const modifiedData = [
      {
        id: 5,
        name: 'Clothing',
        language: 'en',
        translated_languages: ['en'],
        slug: 'clothing',
        banners: [
          {
            id: 16,
            title: 'Shop your designer dresses',
            type_id: 5,
            description:
              'Ready to wear dresses tailored for you online. Hurry up while stock lasts.',
            image: {
              id: 911,
              original:
                'https://lyphy-objects.s3.ap-south-1.amazonaws.com/cloths.png',
              thumbnail:
                'https://lyphy-objects.s3.ap-south-1.amazonaws.com/cloths-thumbnail.jpg',
            },
          },
        ],
        promotional_sliders: [
          {
            id: 902,
            original:
              'https://lyphy-objects.s3.ap-south-1.amazonaws.com/offer-5-thumbnail.jpg',
            thumbnail:
              'https://lyphy-objects.s3.ap-south-1.amazonaws.com/offer-5.png',
          },
          {
            id: 903,
            original:
              'https://lyphy-objects.s3.ap-south-1.amazonaws.com/offer-4-thumbnail.jpg',
            thumbnail:
              'https://lyphy-objects.s3.ap-south-1.amazonaws.com/offer-4.png',
          },
          {
            id: 904,
            original:
              'https://lyphy-objects.s3.ap-south-1.amazonaws.com/offer-3-thumbnail.jpg',
            thumbnail:
              'https://lyphy-objects.s3.ap-south-1.amazonaws.com/offer-3.png',
          },
          {
            id: 905,
            original:
              'https://lyphy-objects.s3.ap-south-1.amazonaws.com/offer-2-thumbnail.jpg',
            thumbnail:
              'https://lyphy-objects.s3.ap-south-1.amazonaws.com/offer-2.png',
          },
          {
            id: 906,
            original:
              'https://lyphy-objects.s3.ap-south-1.amazonaws.com/offer-1-thumbnail.jpg',
            thumbnail:
              'https://lyphy-objects.s3.ap-south-1.amazonaws.com/offer-1.png',
          },
        ],
        settings: {
          isHome: false,
          layoutType: 'classic',
          productCard: 'xenon',
        },
        icon: 'DressIcon',
      },
    ];

    return modifiedData;
  }

  async getType(language: string): Promise<Type> {
    return this.typeModel.findOne().exec();
  }
}
