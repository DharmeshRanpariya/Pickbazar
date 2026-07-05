import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class Attachment {
  @Prop()
  thumbnail?: string;

  @Prop()
  original?: string;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
export type AttachmentDocument = Attachment & Document;
