import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  Attachment,
  AttachmentSchema,
} from 'src/common/entities/attachment.entity';

@Schema()
export class Banner {
  @Prop()
  description: string;

  @Prop({ type: [AttachmentSchema], default: [] })
  image: Attachment[];

  @Prop({ type: Types.ObjectId, ref: 'Type' }) // Reference to Type entity
  type_id: Types.ObjectId;

  @Prop()
  title: string;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);

@Schema()
export class TypeSettings {
  @Prop({ default: false })
  isHome: boolean;

  @Prop()
  layoutType: string;

  @Prop()
  productCard: string;
}

export const TypeSettingsSchema = SchemaFactory.createForClass(TypeSettings);

@Schema()
export class Type {
  @Prop()
  icon: string;

  @Prop()
  language: string;

  @Prop()
  name: string;

  @Prop({ type: [AttachmentSchema], default: [] })
  promotional_sliders: Attachment[];

  @Prop({ type: TypeSettingsSchema })
  settings: TypeSettings;

  @Prop()
  slug: string;

  @Prop({ type: [String], default: [] })
  translated_languages: string[];

  @Prop({ type: [BannerSchema], default: [] }) // Added banners field
  banners: Banner[];
}

export const TypeSchema = SchemaFactory.createForClass(Type);
export type TypeDocument = Type & Document;
