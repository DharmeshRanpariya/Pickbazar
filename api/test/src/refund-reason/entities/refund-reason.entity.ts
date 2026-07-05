import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RefundReason extends Document {
  @Prop({ required: true })
  name: string;
}

export const RefundReasonSchema = SchemaFactory.createForClass(RefundReason);
