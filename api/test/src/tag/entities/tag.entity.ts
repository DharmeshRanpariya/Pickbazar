import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Attachment, AttachmentSchema } from 'src/common/entities/attachment.entity';

@Schema()
export class Tag extends Document {
  @Prop()
  name: string;

  @Prop({ type: [AttachmentSchema], default: [] })
  image?: Attachment;

  @Prop()
  details: string;

  @Prop()
  icon: string;

  @Prop()
  type: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
export type TagDocument = Tag & Document;
