import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Attachment, AttachmentSchema } from 'src/common/entities/attachment.entity';
import { Variation } from 'src/product/entities/product.entity';

export enum RefundStatusType {
  PENDING = 'pending',
  PROCESSING = 'processing',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PARTIAL ='parial',
}

@Schema({ timestamps: true })
export class Refund extends Document {
  @Prop()
  refundReason: string;

  @Prop()
  description?: string;

  @Prop({ type: [AttachmentSchema], default: [] })
  image?: Attachment[];

  @Prop({ type: Types.ObjectId, ref: 'Order' })
  orderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Variation', default: null })
  variationOptionsId: Variation | Types.ObjectId;

  @Prop({ ref: 'Coupon', default: null })
  couponType: string | null;
  
  @Prop({ ref: 'FlashSale', default: null })
  flashSaleType: string | null;

  @Prop({ required: true })
  quantity: number;

  @Prop({ enum: RefundStatusType, default: RefundStatusType.PENDING })
  status: RefundStatusType;
}

export const RefundSchema = SchemaFactory.createForClass(Refund);