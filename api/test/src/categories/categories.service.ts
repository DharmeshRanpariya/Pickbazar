import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './entities/category.entity';
import { join } from 'path';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { pagination } from 'src/common/pagination/pagination';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  async findAll(page: number, limit: number, name?: string): Promise<any> {
    const cacheDir = join(__dirname, '../../src/cache');
    const filePath = join(cacheDir, 'categories.json');

    if (isNaN(page) || isNaN(limit)) {
      throw new BadRequestException('Page and limit must be numbers');
    }

    page = Math.max(1, Math.floor(page));
    limit = Math.max(1, Math.floor(limit));

    const filter: any = {};
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    const totalItems = await this.categoryModel.countDocuments(filter).exec();
    const categories = await this.categoryModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: categories,
      ...pagination(totalItems, page, limit, categories.length),
    };
  }

  async findOne(id: string): Promise<Category> {
    return this.categoryModel.findById(id).exec();
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
    return this.categoryModel;
  }

  async remove(id: string): Promise<Category> {
    return this.categoryModel.findByIdAndDelete(id).exec();
  }
}
