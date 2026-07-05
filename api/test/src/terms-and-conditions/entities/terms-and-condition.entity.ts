import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class TermsAndCondition extends Document {
  @Prop()
  title: string;

  @Prop()
  description: string;
}

export const TermsAndConditionSchema =
  SchemaFactory.createForClass(TermsAndCondition);
