import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  Attachment,
  AttachmentSchema,
} from 'src/common/entities/attachment.entity';

export enum FlashSaleType {
  FIXRATE = 'fixrate',
  PERCENTAGE = 'percentage',
}

@Schema({ timestamps: true })
export class FlashSale extends Document {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  @Prop({ type: String })
  startTime: string;

  @Prop({ type: String })
  endTime: string;

  @Prop({ type: AttachmentSchema })
  image?: Attachment;

  @Prop({ type: AttachmentSchema })
  coverImage?: Attachment;

  @Prop({ enum: FlashSaleType })
  type: FlashSaleType;

  @Prop({ default: false })
  saleStatus: boolean;

  @Prop()
  rate: number;
}

export const FlashSaleSchema = SchemaFactory.createForClass(FlashSale);
