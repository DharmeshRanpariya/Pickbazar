import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RefundPolicy {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  target: string;

  @Prop()
  status: string;
}

export type RefundPolicyDocument = RefundPolicy & Document;
export const RefundPolicySchema = SchemaFactory.createForClass(RefundPolicy);
