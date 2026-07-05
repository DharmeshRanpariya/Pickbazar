import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRefundPolicyDto } from './dto/create-refund-policy.dto';
import { UpdateRefundPolicyDto } from './dto/update-refund-policy.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RefundPolicy } from './entities/refund-policy.entity';
import { Model } from 'mongoose';
import { pagination } from '../common/pagination/pagination';

@Injectable()
export class RefundPolicyService {
  constructor(
    @InjectModel(RefundPolicy.name)
    private readonly RefundPolicyModel: Model<RefundPolicy>,
  ) {}

  create(createRefundPolicyDto: CreateRefundPolicyDto) {
    const createdRefundPolicy = new this.RefundPolicyModel(
      createRefundPolicyDto,
    );
    return createdRefundPolicy.save();
  }

  async findAll({
    page,
    limit,
    title,
    target,
    status,
    orderBy,
    sortedBy,
  }: any): Promise<any> {
    if (isNaN(page) || isNaN(limit)) {
      throw new BadRequestException('Page and limit must be numbers');
    }

    page = Math.max(1, Math.floor(page));
    limit = Math.max(1, Math.floor(limit));

    const filter: any = {};
    if (title) filter.title = new RegExp(title, 'i');
    if (target) filter.target = target;
    if (status) filter.status = status;

    const sort: any = {};
    sort[orderBy] = sortedBy === 'desc' ? -1 : 1;

    const totalItems = await this.RefundPolicyModel.countDocuments(filter).exec();
    const refundPolicies = await this.RefundPolicyModel.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort)
      .lean()
      .exec();

    return {
      data: refundPolicies,
      ...pagination(totalItems, page, limit, refundPolicies.length),
    };
  }

  async findOne(id: string): Promise<RefundPolicy> {
    const refundPolicy = await this.RefundPolicyModel.findById(id).exec();
    if (!refundPolicy) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return refundPolicy;
  }

  async update(id: string, updateRefundPolicyDto: UpdateRefundPolicyDto) {
    const existingRefundPolicy = await this.RefundPolicyModel.findByIdAndUpdate(
      id,
      updateRefundPolicyDto,
      { new: true },
    ).exec();
    if (!existingRefundPolicy) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return existingRefundPolicy;
  }

  async remove(id: string) {
    const deletedRefundPolicy =
      await this.RefundPolicyModel.findByIdAndDelete(id).exec();
    if (!deletedRefundPolicy) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return deletedRefundPolicy;
  }
}
