import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  Attribute,
  AttributeSchema,
} from 'src/attributes/entities/attribute.entity';
import {
  Attachment,
  AttachmentSchema,
} from 'src/common/entities/attachment.entity';
import {
  Category,
  CategorySchema,
} from '../../categories/entities/category.entity';
import { Types } from 'mongoose';

@Schema()
export class VariationOption {
  @Prop()
  name: string;

  @Prop()
  value: string;
}

export const VariationOptionSchema =
  SchemaFactory.createForClass(VariationOption);

@Schema()
export class AttributeValue {
  @Prop()
  attribute_value_id: string;

  @Prop()
  value: string;

  @Prop()
  meta?: string;

  @Prop({ type: [Types.ObjectId], ref: 'Attribute' })
  attribute: Attribute;
}
export const AttributeValueSchema =
  SchemaFactory.createForClass(AttributeValue);

@Schema()
export class Variation {
  @Prop()
  title: string;

  @Prop()
  price: number;

  @Prop()
  sku: string;

  @Prop()
  is_disable: boolean;

  @Prop()
  sale_price?: number;

  @Prop()
  quantity: number;

  @Prop({ type: [AttachmentSchema], default: [] })
  image?: Attachment[];

  @Prop({ type: [VariationOptionSchema] })
  options: VariationOption[];
}

export const VariationSchema = SchemaFactory.createForClass(Variation);

@Schema()
export class Product {
  @Prop({ type: [AttachmentSchema], default: [] })
  image?: Attachment;

  @Prop({ type: [AttachmentSchema], default: [] })
  gallery?: Attachment[];

  @Prop({ type: [Types.ObjectId], ref: 'Category' })
  categories?: Category[];

  @Prop()
  tags?: string[];

  @Prop({ default: null })
  review?: number;

  @Prop()
  name?: string;

  @Prop()
  unit?: string;

  @Prop()
  description?: string;

  @Prop()
  status?: string;

  @Prop()
  price: number;

  @Prop()
  sale_price?: number;

  @Prop()
  quantity: number;

  @Prop()
  sku?: string;

  @Prop()
  width?: number;

  @Prop()
  height?: number;

  @Prop()
  length?: number;

  @Prop()
  product_type?: string;

  @Prop()
  min_price: number;

  @Prop()
  max_price: number;

  @Prop()
  variations: AttributeValue[];

  @Prop({ type: [VariationSchema] })
  variationOptions?: Variation[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
export type ProductDocument = Product & Document;
