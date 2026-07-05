import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product, ProductSchema } from 'src/product/entities/product.entity';
import { Address, AddressSchema } from 'src/users/entities/address.entity';
import { User } from 'src/users/entities/user.entity';

export enum PaymentGatewayType {
  STRIPE = 'STRIPE',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  CASH = 'CASH',
  FULL_WALLET_PAYMENT = 'FULL_WALLET_PAYMENT',
  PAYPAL = 'PAYPAL',
  RAZORPAY = 'RAZORPAY',
}

export enum OrderStatusType {
  PENDING = 'order-pending',
  PLACED = 'order-placed',
  PROCESSING = 'order-processing',
  COMPLETED = 'order-completed',
  CANCELLED = 'order-cancelled',
  REFUNDED = 'order-refunded',
  FAILED = 'order-failed',
  AT_LOCAL_FACILITY = 'order-at-local-facility',
  OUT_FOR_DELIVERY = 'order-out-for-delivery',
}

export enum PaymentStatusType {
  PENDING = 'payment-pending',
  PROCESSING = 'payment-processing',
  SUCCESS = 'payment-success',
  FAILED = 'payment-failed',
}

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop()
  trackingNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  customer: User;

  @Prop({ default: OrderStatusType.PENDING })
  orderStatus: OrderStatusType;

  @Prop({ default: null })
  cancelReason: string;

  @Prop({ default: null })
  cancelDescription: string;

  @Prop()
  paidTotal: number;

  @Prop({ default: null })
  refundStatus: string;

  @Prop()
  amount: number;

  @Prop()
  customerContact: number;

  @Prop()
  customerName: string;

  @Prop()
  salesTax: number;

  @Prop()
  paymentId?: string;

  @Prop({ type: Types.ObjectId, ref: 'Coupon', default: null })
  couponId: Types.ObjectId | null; 

  @Prop()
  paymentGateway: PaymentGatewayType;

  @Prop({ default: PaymentStatusType.PENDING })
  paymentStatus: PaymentStatusType;

  @Prop()
  discount?: number;

  @Prop()
  flashSaleDiscount?: number;

  @Prop()
  deliveryFee: number;

  @Prop()
  deliveryTime: string;

  @Prop([
    {
      userId: { type: String },
      product: { type: ProductSchema },
      quantity: Number,
      total: Number,
      price: Number,
      variationOptionsId: { type: String },
      refundStatus: { type: String, default: null },
    },
  ])
  items: {
    userId: string;
    product: Product;
    quantity: number;
    total: number;
    price: Number;
    variationOptionsId?: string;
    refundStatus?: string | null;
  }[];

  @Prop({ type: Types.ObjectId, ref: 'Address' })
  billingAddress: Address;

  @Prop({ type: Types.ObjectId, ref: 'Address' })
  shippingAddress: Address;

  @Prop()
  alteredPaymentGateway?: string;

  @Prop()
  note: string;

  @Prop({ default: null })
  invoiceUrl: string;

  @Prop({ default: null })
  razorpayOrderId: string;

  @Prop({ default: null })
  razorpayPaymentId: string;

  @Prop({ default: null })
  razorpaySignature: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
