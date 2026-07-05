import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Faq } from './entities/faq.entity';
import { pagination } from '../common/pagination/pagination';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { CreateFaqDto } from './dto/create-faq.dto';

@Injectable()
export class FaqsService {
  constructor(
    @InjectModel(Faq.name) private faqModel: Model<Faq>
  ) {}

  async create(createFaqDto: CreateFaqDto): Promise<Faq> {
    const newFaq = new this.faqModel(createFaqDto);
    return await newFaq.save();
  }

  async findAll(
    page: number,
    limit: number,
    title: string,
    sortedBy: string,
    orderBy: 'asc' | 'desc',
  ): Promise<any> {
    if (isNaN(page) || isNaN(limit)) {
      throw new BadRequestException('Page and limit must be numbers');
    }
    page = Math.max(1, Math.floor(page));
    limit = Math.max(1, Math.floor(limit));

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

    const totalItems = await this.faqModel.countDocuments(filterQuery).exec();
    const faqs = await this.faqModel
      .find(filterQuery)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    return {
      data: faqs,
      ...pagination(totalItems, page, limit, faqs.length),
    };
  }

  async findOne(id: string): Promise<Faq> {
    const faq = await this.faqModel.findById(id).exec();
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    return faq;
  }

  async update(id: string, updateFaqDto: UpdateFaqDto): Promise<Faq> {
    const updatedFaq = await this.faqModel
      .findByIdAndUpdate(id, updateFaqDto, {
        new: true,
      })
      .exec();

    if (!updatedFaq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    return updatedFaq;
  }

  async remove(id: string): Promise<Faq> {
    const deletedFaq = await this.faqModel.findByIdAndDelete(id).exec();
    if (!deletedFaq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    return deletedFaq;
  }
}
