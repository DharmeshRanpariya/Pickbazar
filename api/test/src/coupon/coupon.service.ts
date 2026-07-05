import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './entities/coupon.entity';
import { pagination } from 'src/common/pagination/pagination';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name) private readonly couponModel: Model<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
    const currentDate = new Date();

    const activeFormDate = new Date(createCouponDto.activeForm);
    const expireAtDate = new Date(createCouponDto.expireAt);

    const startTimeParts = createCouponDto.startTime.split(':');
    activeFormDate.setHours(parseInt(startTimeParts[0]), parseInt(startTimeParts[1]));

    const endTimeParts = createCouponDto.endTime.split(':');
    expireAtDate.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]));

    if (activeFormDate < currentDate) {
      throw new BadRequestException('Start date and time cannot be in the past');
    }

    if (expireAtDate < activeFormDate) {
      throw new BadRequestException('End date and time cannot be before start date and time');
    }

    const createdCoupon = new this.couponModel({
      ...createCouponDto,
      activeForm: activeFormDate,
      expireAt: expireAtDate,
    });

    return await createdCoupon.save();
  }
  async findAll(
    page: number,
    limit: number,
    orderBy: string,
    sortedBy: string,
    code?: string,
  ): Promise<any> {
    if (isNaN(page) || isNaN(limit)) {
      throw new BadRequestException('Page and limit must be numbers');
    }
    page = Math.max(1, Math.floor(page));
    limit = Math.max(1, Math.floor(limit));
  
    const sort = {};
    sort[orderBy] = sortedBy === 'desc' ? -1 : 1;
    const query = code ? { code: new RegExp(code, 'i') } : {};

    const totalItems = await this.couponModel.countDocuments(query).exec();
    const coupons = await this.couponModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort)
      .exec();

    const paginationData = pagination(totalItems, page, limit, coupons.length);

    return {
      data: coupons,
      ...paginationData,
    };
  }
  
  async findOne(id: string): Promise<Coupon> {
    const coupon = await this.couponModel.findById(id).exec();
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
    return coupon;
  }
  
  async update(id: string, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
    const currentDate = new Date();

    let existingCoupon = await this.couponModel.findById(id).exec();
    if (!existingCoupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }

    const activeFormDate = updateCouponDto.activeForm
      ? new Date(updateCouponDto.activeForm)
      : existingCoupon.activeForm;
    const expireAtDate = updateCouponDto.expireAt
      ? new Date(updateCouponDto.expireAt)
      : existingCoupon.expireAt;

    const startTimeParts = updateCouponDto.startTime
      ? updateCouponDto.startTime.split(':')
      : existingCoupon.startTime.split(':');
    activeFormDate.setHours(parseInt(startTimeParts[0]), parseInt(startTimeParts[1]));

    const endTimeParts = updateCouponDto.endTime
      ? updateCouponDto.endTime.split(':')
      : existingCoupon.endTime.split(':');
    expireAtDate.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]));

    if (activeFormDate < currentDate) {
      throw new BadRequestException('Start date and time cannot be in the past');
    }

    if (expireAtDate < activeFormDate) {
      throw new BadRequestException('End date and time cannot be before start date and time');
    }

    return await this.couponModel
      .findByIdAndUpdate(
        id,
        { ...updateCouponDto, activeForm: activeFormDate, expireAt: expireAtDate },
        { new: true },
      )
      .exec();
  }
  async remove(id: string): Promise<Coupon> {
    const deletedCoupon = await this.couponModel.findByIdAndDelete(id).exec();
    if (!deletedCoupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
    return deletedCoupon;
  }
  
  async verifyCoupon(
    code: string,
    sub_total: number,
  ): Promise<{ is_valid: boolean; coupon?: Coupon; new_sub_total?: number }> {
    const coupon = await this.couponModel.findOne({ code }).exec();
    if (!coupon) {
      throw new NotFoundException(`Coupon with code ${code} not found`);
    }
    if (!coupon.isApprove) {
      throw new BadRequestException(`Coupon with code ${code} is not approved`);
    }
    if (new Date(coupon.expireAt) < new Date()) {
      throw new BadRequestException(`Coupon with code ${code} has expired`);
    }
    if (new Date(coupon.activeForm) > new Date()) {
      throw new BadRequestException(
        `Coupon with code ${code} has not started yet`,
      );
    }
    if (sub_total < coupon.minimumCartAmount) {
      throw new BadRequestException(
        `The subtotal does not meet the minimum required to use this coupon`,
      );
    }
    return { is_valid: true, coupon };
  }
}
