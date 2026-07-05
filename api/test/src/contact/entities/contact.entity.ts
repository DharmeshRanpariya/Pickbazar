import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Contact extends Document {
  @Prop()
  name: string;
  @Prop()
  email: string;
  @Prop()
  subject: string;
  @Prop()
  description: string;
}
export const ContactSchema = SchemaFactory.createForClass(Contact);
