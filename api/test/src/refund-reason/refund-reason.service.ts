import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRefundReasonDto } from './dto/create-refund-reason.dto';
import { UpdateRefundReasonDto } from './dto/update-refund-reason.dto';
import { RefundReason } from './entities/refund-reason.entity';

@Injectable()
export class RefundReasonService {
  constructor(
    @InjectModel(RefundReason.name)
    private readonly refundReasonModel: Model<RefundReason>,
  ) {}

  async create(createRefundReasonDto: CreateRefundReasonDto): Promise<RefundReason> {
    const refundReason = new this.refundReasonModel(createRefundReasonDto);
    return refundReason.save();
  }

  async findAll(name?: string): Promise<RefundReason[]> {
    const filter: any = {};
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    return this.refundReasonModel.find(filter).exec();
  }

  async findOne(id: string): Promise<RefundReason> {
    const refundReason = await this.refundReasonModel.findById(id).exec();
    if (!refundReason) {
      throw new NotFoundException(`RefundReason with ID "${id}" not found`);
    }
    return refundReason;
  }

  async update(id: string, updateRefundReasonDto: UpdateRefundReasonDto): Promise<RefundReason> {
    const existingRefundReason = await this.refundReasonModel
      .findByIdAndUpdate(id, updateRefundReasonDto, { new: true })
      .exec();

    if (!existingRefundReason) {
      throw new NotFoundException(`RefundReason with ID "${id}" not found`);
    }

    return existingRefundReason;
  }

  async remove(id: string): Promise<RefundReason> {
    const refundReason = await this.refundReasonModel
      .findByIdAndDelete(id)
      .exec();
    if (!refundReason) {
      throw new NotFoundException(`RefundReason with ID "${id}" not found`);
    }
    return refundReason;
  }
}
