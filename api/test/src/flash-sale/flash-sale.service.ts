import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFlashSaleDto } from './dto/create-flash-sale.dto';
import { UpdateFlashSaleDto } from './dto/update-flash-sale.dto';
import { FlashSale } from './entities/flash-sale.entity';
import { pagination } from 'src/common/pagination/pagination';

@Injectable()
export class FlashSaleService {
  constructor(
    @InjectModel(FlashSale.name)
    private readonly flashSaleModel: Model<FlashSale>,
  ) {}

  async create(createFlashSaleDto: CreateFlashSaleDto): Promise<FlashSale> {
    const currentDate = new Date();

    const startDate = new Date(createFlashSaleDto.startDate);
    const endDate = new Date(createFlashSaleDto.endDate);
  
    const startTime = createFlashSaleDto.startTime.split(':');
    startDate.setHours(parseInt(startTime[0]), parseInt(startTime[1]));
  
    const endTime = createFlashSaleDto.endTime.split(':');
    endDate.setHours(parseInt(endTime[0]), parseInt(endTime[1]));
  
    if (startDate < currentDate) {
      throw new BadRequestException('Start date and time cannot be in the past');
    }

    if (endDate < startDate) {
      throw new BadRequestException('End date and time cannot be before start date and time');
    }
  
    const createdFlashSale = new this.flashSaleModel({
      ...createFlashSaleDto,
      startDate,
      endDate,
    });

    return createdFlashSale.save();
  }

  async findAll({ page, limit, orderBy, sortedBy, title }): Promise<any> {
    if (isNaN(page) || isNaN(limit)) {
      throw new BadRequestException('Page and limit must be numbers');
    }

    page = Math.max(1, Math.floor(page));
    limit = Math.max(1, Math.floor(limit));

    const filter: any = {};
    if (title) {
      filter.title = { $regex: new RegExp(title, 'i') };
    }

    const sort: any = {};
    sort[orderBy] = sortedBy === 'desc' ? -1 : 1;

    const totalItems = await this.flashSaleModel.countDocuments(filter).exec();
    const flashSales = await this.flashSaleModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort)
      .exec();

    return {
      data: flashSales,
      ...pagination(totalItems, page, limit, flashSales.length),
    };
  }

  async findOne(id: string): Promise<FlashSale> {
    const flashSale = await this.flashSaleModel.findById(id).exec();
    if (!flashSale) {
      throw new NotFoundException(`FlashSale with ID ${id} not found`);
    }
    return flashSale;
  }

  async update(
    id: string,
    updateFlashSaleDto: UpdateFlashSaleDto,
  ): Promise<FlashSale> {
    const currentDate = new Date();
    let existingFlashSale = await this.flashSaleModel.findById(id).exec();

    if (!existingFlashSale) {
      throw new NotFoundException(`FlashSale with ID ${id} not found`);
    }

    const startDate = updateFlashSaleDto.startDate
      ? new Date(updateFlashSaleDto.startDate)
      : existingFlashSale.startDate;
    const endDate = updateFlashSaleDto.endDate
      ? new Date(updateFlashSaleDto.endDate)
      : existingFlashSale.endDate;
  
    const startTime = updateFlashSaleDto.startTime
      ? updateFlashSaleDto.startTime.split(':')
      : existingFlashSale.startTime.split(':');
    startDate.setHours(parseInt(startTime[0]), parseInt(startTime[1]));
  
    const endTime = updateFlashSaleDto.endTime
      ? updateFlashSaleDto.endTime.split(':')
      : existingFlashSale.endTime.split(':');
    endDate.setHours(parseInt(endTime[0]), parseInt(endTime[1]));
  
    if (startDate < currentDate) {
      throw new BadRequestException('Start date and time cannot be in the past');
    }

    if (endDate < startDate) {
      throw new BadRequestException('End date and time cannot be before start date and time');
    }

    existingFlashSale = await this.flashSaleModel
      .findByIdAndUpdate(id, { ...updateFlashSaleDto, startDate, endDate }, { new: true })
      .exec();

    return existingFlashSale;
  }

  async remove(id: string): Promise<void> {
    const result = await this.flashSaleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`FlashSale with ID ${id} not found`);
    }
  }

  async findActiveFlashSales(): Promise<FlashSale[]> {
    const currentDate = new Date();

    const flashSales = await this.flashSaleModel.find().exec();
    const bulkOps = [];

    for (const flashSale of flashSales) {
      const isActive = flashSale.startDate <= currentDate && flashSale.endDate >= currentDate;
      if (flashSale.saleStatus !== isActive) {
        bulkOps.push({
          updateOne: {
            filter: { _id: flashSale._id },
            update: { saleStatus: isActive },
          },
        });
      }
    }

    if (bulkOps.length > 0) {
      await this.flashSaleModel.bulkWrite(bulkOps);
    }

    return this.flashSaleModel
      .find({
        saleStatus: true,
      })
      .exec();
  }
}
