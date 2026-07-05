import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from 'src/product/entities/product.entity';

@Schema()
export class Cart {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Product;

  @Prop({ default: 1 })
  quantity: number;

  @Prop()
  total: number;

  @Prop()
  variationOptionsId: string;
}
export const CartSchema = SchemaFactory.createForClass(Cart);
export type CartDocument = Cart & Document;
