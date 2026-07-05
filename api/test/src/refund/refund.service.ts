import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRefundDto } from './dto/create-refund.dto';
import { UpdateRefundDto } from './dto/update-refund.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Refund, RefundStatusType } from './entities/refund.entity';
import { Model } from 'mongoose';
import { Order, OrderStatusType } from 'src/order/entities/order.entity';
import { join } from 'path';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { Product, Variation } from 'src/product/entities/product.entity';
import { Types } from 'mongoose';
import { Coupon } from 'src/coupon/entities/coupon.entity';
import { FlashSaleService } from 'src/flash-sale/flash-sale.service';

@Injectable()
export class RefundService {
  constructor(
    @InjectModel(Refund.name)
    private readonly RefundModel: Model<Refund>,
    @InjectModel(Order.name)
    private readonly OrderModel: Model<Order>,
    @InjectModel(Product.name)
    private readonly ProductModel: Model<Product>,
    @InjectModel(Variation.name)
    private readonly VariationModel: Model<Variation>,
    @InjectModel(Coupon.name)
    private readonly CouponModel: Model<Coupon>,
    private readonly flashSaleService: FlashSaleService,
  ) {}

  async create(createRefundDto: CreateRefundDto) {
    const order = await this.OrderModel.findById(
      createRefundDto.orderId,
    ).populate('items.product');

    if (!order) {
      throw new NotFoundException(
        `Order with ID ${createRefundDto.orderId} not found`,
      );
    }

    if (order.orderStatus !== 'order-completed') {
      throw new BadRequestException(
        'Refunds can only be created for completed orders.',
      );
    }

    const existingRefund = await this.RefundModel.findOne({
      orderId: createRefundDto.orderId,
      productId: createRefundDto.productId,
      variationOptionsId: createRefundDto.variationOptionsId,
    });

    if (existingRefund) {
      throw new BadRequestException(
        `This product with variation ID ${createRefundDto.variationOptionsId} has already been refunded for the same order.`,
      );
    }
    order.items.forEach((item) => {
      if (item?.product?.variationOptions?.length === 0) {
        if (item?.product['_id'].toString() === createRefundDto.productId) {
          item.refundStatus = 'pending';
        }
      } else {
        if (
          item?.product['_id'].toString() === createRefundDto.productId &&
          item?.product?.variationOptions?.[0]['_id'].toString() ===
          createRefundDto.variationOptionsId
        ) {
          item.refundStatus = 'pending';
        }
      }
    });
    const allPending = order.items.every(
      (item) => item.refundStatus === 'pending',
    );
    const anyRefundedOrNone = order.items.some(
      (item) =>
        item.refundStatus === 'none' || item.refundStatus === 'refunded',
    );

    if (allPending) {
      order.refundStatus = 'refunded';
    } else if (anyRefundedOrNone) {
      order.refundStatus = 'partial';
    } else {
      order.refundStatus = 'none';
    }
    await order.save();

    let couponType = null;
    if (order.couponId) {

      const coupon = await this.CouponModel.findById(order.couponId);
      if (!coupon) {
        throw new NotFoundException(`Coupon with ID ${order.couponId} not found`);
      }
      couponType = coupon.type;
    }


    const activeFlashSales = await this.flashSaleService.findActiveFlashSales();
    let flashSaleType = null;

    for (const sale of activeFlashSales) {
      const saleStart = new Date(sale.startDate).getTime();
      const saleEnd = new Date(sale.endDate).getTime();
      const orderDate = new Date(order.createdAt).getTime();

      if (orderDate >= saleStart && orderDate <= saleEnd) {
        flashSaleType = sale.type;
        break;
      }
    }

    const refund = new this.RefundModel({
      ...createRefundDto,
      couponType,
      flashSaleType,
    });

    return await refund.save();
  }

  async getRefundAnalytics(): Promise<{
    totalRefunds: number;
    refundsByStatus: Record<RefundStatusType, number>;
    todayRefundsByStatus: Record<RefundStatusType, number>;
    weeklyRefundsByStatus: Record<RefundStatusType, number>;
    monthlyRefundsByStatus: Record<RefundStatusType, number>;
    yearlyRefundsByStatus: Record<RefundStatusType, number>;
    refundsByMonth: Array<{ total: number; month: string }>;
  }> {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const refundsByStatus = await this.getRefundsByStatus();
    const todayRefundsByStatus = await this.getRefundsByStatus(startOfToday);
    const weeklyRefundsByStatus = await this.getRefundsByStatus(startOfWeek);
    const monthlyRefundsByStatus = await this.getRefundsByStatus(startOfMonth);
    const yearlyRefundsByStatus = await this.getRefundsByStatus(startOfYear);

    return {
      totalRefunds: await this.RefundModel.countDocuments(),
      refundsByStatus,
      todayRefundsByStatus,
      weeklyRefundsByStatus,
      monthlyRefundsByStatus,
      yearlyRefundsByStatus,
      refundsByMonth: await this.getRefundsByMonth(startOfYear),
    };
  }

  private async getRefundsByStatus(startDate?: Date, endDate?: Date): Promise<Record<RefundStatusType, number>> {
    const matchCondition: any = {};
    if (startDate) matchCondition.createdAt = { $gte: startDate };
    if (endDate) matchCondition.createdAt.$lt = endDate;

    const refundsByStatusData = await this.RefundModel.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const counts: Record<RefundStatusType, number> = {
      [RefundStatusType.PENDING]: 0,
      [RefundStatusType.PROCESSING]: 0,
      [RefundStatusType.APPROVED]: 0,
      [RefundStatusType.REJECTED]: 0,
      [RefundStatusType.PARTIAL]: 0,
    };

    refundsByStatusData.forEach((item) => {
      counts[item._id] = item.count || 0;
    });

    return counts;
  }

  private async getRefundCount(startDate: Date, endDate?: Date): Promise<number> {
    const matchCondition: any = { createdAt: { $gte: startDate } };
    if (endDate) {
      matchCondition.createdAt.$lt = endDate;
    }
    return this.RefundModel.countDocuments(matchCondition);
  }

  private async getRefundsByMonth(startOfYear: Date): Promise<
    Array<{ total: number; month: string }>
  > {
    const refundsByMonthData = await this.RefundModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          total: { $sum: 1 },
        },
      },
    ]);

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    return months.map((month, index) => {
      const monthData = refundsByMonthData.find((data) => data._id.month === index + 1);
      return {
        total: monthData ? monthData.total : 0,
        month,
      };
    });
  }

  async findOne(id: string): Promise<Refund> {
    const refund = await this.RefundModel.findById(id)
      .populate({
        path: 'productId',
        model: 'Product',
      })
      .populate({
        path: 'orderId',
        populate: {
          path: 'customer',
          model: 'User',
        },
      })
      .exec();

    if (!refund) {
      throw new NotFoundException(`Refund with ID ${id} not found`);
    }

    const product = await this.ProductModel.findById(refund.productId._id);

    if (product) {
      const matchedOption = product.variationOptions.find(
        (option: any) =>
          option._id.toString() === refund.variationOptionsId.toString(),
      );

      refund.variationOptionsId = matchedOption || null;
    } else {
      refund.variationOptionsId = null;
    }

    return refund;
  }

  async findAll(refundReason?: string, status?: RefundStatusType, sortOrder: 'asc' | 'desc' = 'desc'): Promise<any> {
    let refunds: any[] = [];

    const filter: any = {};

    if (refundReason) {
      filter.refundReason = { $regex: new RegExp(refundReason, 'i') };
    }

    if (status) {
      filter.status = status;
    }

    refunds = await this.RefundModel.find(filter)
      .populate({
        path: 'orderId',
        populate: {
          path: 'customer',
          model: 'User',
        },
      })
      .sort({ createdAt: sortOrder === 'asc' ? 1 : -1 })
      .lean()
      .exec();

    return refunds;
  }

  async remove(id: string): Promise<void> {
    const result = await this.RefundModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Refund with ID ${id} not found`);
    }
  }

  async updateStatus(
    refundId: string,
    status: RefundStatusType,
  ): Promise<void> {
    const refund = await this.RefundModel.findById(refundId).exec();
    if (!refund) {
      throw new NotFoundException(`Refund with ID ${refundId} not found`);
    }

    refund.status = status;
    await refund.save();

    const order = await this.OrderModel.findById(refund.orderId).exec();
    if (!order) {
      throw new NotFoundException(
        `Order with ID ${refund.orderId} associated with the refund not found`,
      );
    }

    order.items.forEach((item) => {
      if (item?.product?.variationOptions?.length === 0) {
        if (item?.product['_id'].toString() === refund.productId.toString()) {
          item.refundStatus = status;
        }
      } else {
        if (
          item?.product['_id'].toString() === refund.productId.toString() &&
          item?.product?.variationOptions?.[0]['_id'].toString() ===
          refund.variationOptionsId?.toString()
        ) {
          item.refundStatus = status;
        }
      }
    });

    const allRefunded = order.items.every(
      (item) => item.refundStatus === 'refunded',
    );
    const anyPending = order.items.some((item) => item.refundStatus === 'pending');

    if (allRefunded) {
      order.refundStatus = 'refunded';
    } else if (anyPending) {
      order.refundStatus = 'partial';
    } else {
      order.refundStatus = 'none';
    }

    await order.save();
  }
}