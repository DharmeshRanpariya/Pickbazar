import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import {
  Attachment,
  AttachmentSchema,
} from 'src/common/entities/attachment.entity';
import { Address } from './address.entity';

@Schema()
export class User {
  toObject(): { [x: string]: any; password: any } {
    throw new Error('Method not implemented.');
  }

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: null })
  provider: string;
  
  @Prop({ type: AttachmentSchema })
  photoUrl: Attachment;

  @Prop({ default: 'User' })
  permissions?: string;

  @Prop({ default: null })
  resetPasswordToken: string;

  @Prop({ default: null })
  emailToken: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  profilephoto: string;

  @Prop({ default: null })
  bio: string;

  @Prop({ default: null })
  phoneNumber: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }] })
  address: Address[];
}

export type UserDocument = User & Document & { _id: mongoose.Types.ObjectId };
export const UserSchema = SchemaFactory.createForClass(User);
