import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag, TagDocument } from './entities/tag.entity';
import { pagination } from '../common/pagination/pagination';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const createdTag = new this.tagModel(createTagDto);
    return createdTag.save();
  }

  async findAll(page: number, limit: number, name?: string): Promise<any> {
    if (isNaN(page) || isNaN(limit)) {
      throw new BadRequestException('Page and limit must be numbers');
    }
    page = Math.max(1, Math.floor(page));
    limit = Math.max(1, Math.floor(limit));

    let query = this.tagModel.find();

    if (name) {
      query = query.where('name').regex(new RegExp(`^${name}`, 'i'));
    }

    const totalItems = await this.tagModel.countDocuments(query).exec();
    const tags = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      data: tags,
      ...pagination(totalItems, page, limit, tags.length),
    };
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagModel.findById(id).exec();
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    const updatedTag = await this.tagModel
      .findByIdAndUpdate(id, updateTagDto, { new: true })
      .exec();
    if (!updatedTag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return updatedTag;
  }

  async remove(id: string): Promise<Tag> {
    const deletedTag = await this.tagModel.findByIdAndDelete(id).exec();
    if (!deletedTag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return deletedTag;
  }
}
