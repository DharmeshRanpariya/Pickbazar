import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Faq extends Document {
  @Prop()
  title: string;

  @Prop()
  description: string;
}

export const FaqSchema = SchemaFactory.createForClass(Faq);
