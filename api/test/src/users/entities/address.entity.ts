import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Address {
  @Prop()
  title: string;

  @Prop()
  type: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  zip: string;

  @Prop()
  street_address: string;
}
export type AddressDocument = Address & Document;
export const AddressSchema = SchemaFactory.createForClass(Address);
