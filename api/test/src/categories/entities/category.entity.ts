import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Attachment } from 'src/common/entities/attachment.entity';

@Schema()
export class Category {
  @Prop()
  name: string;

  @Prop()
  parent?: string;

  @Prop()
  details?: string;

  @Prop()
  image?: Attachment;

  @Prop()
  icon?: string;

  @Prop()
  type?: string;
}

export type CategoryDocument = Category & Document;
export const CategorySchema = SchemaFactory.createForClass(Category);
