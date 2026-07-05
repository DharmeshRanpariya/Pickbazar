import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  Attachment,
  AttachmentSchema,
} from 'src/common/entities/attachment.entity';

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop()
  rating: number;

  @Prop({ type: [AttachmentSchema], required: false })
  photos: Attachment[];

  @Prop()
  comment: string;

  @Prop({ type: Types.ObjectId, ref: 'Product' })
  productId: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: string;
}
export const ReviewSchema = SchemaFactory.createForClass(Review);
