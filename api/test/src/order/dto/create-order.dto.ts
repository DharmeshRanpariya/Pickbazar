import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Address } from 'src/users/entities/address.entity';
import { Types } from 'mongoose';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  trackingNumber: string;
  customer: Types.ObjectId;
  items: {
    userId: Types.ObjectId;
    productId: Types.ObjectId;
    quantity: number;
    total: number;
  }[];
  couponId?: string;
  billingAddress?: Address;
  shippingAddress?: Address;
  amount: number;
  salesTax?: number;
  paymentId?: string;
  paymentGateway: string;
  discount?: number;
  deliveryFee: number;
  deliveryTime: string;
}
