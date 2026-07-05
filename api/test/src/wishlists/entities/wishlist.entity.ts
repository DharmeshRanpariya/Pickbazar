import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from 'src/product/entities/product.entity';

@Schema()
export class Wishlist {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  productId: Product;

  @Prop({ required: true })
  userId: string;
}

export type WishlistDocument = Wishlist & Document;
export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
