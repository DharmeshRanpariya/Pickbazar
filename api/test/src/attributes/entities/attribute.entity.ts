import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Attachment } from 'src/common/entities/attachment.entity';

@Schema()
export class Value {
  @Prop()
  value: string;

  @Prop()
  meta: string;

  @Prop({ type: Attachment, required: false })
  image?: Attachment;
}

export const ValueSchema = SchemaFactory.createForClass(Value);

@Schema()
export class Attribute extends Document {
  @Prop()
  name: string;

  @Prop({ type: [ValueSchema] })
  values: Value[];
}

export const AttributeSchema = SchemaFactory.createForClass(Attribute);
