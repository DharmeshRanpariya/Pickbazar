import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Attachment, AttachmentSchema } from 'src/common/entities/attachment.entity';

@Schema()
export class Coupon extends Document {
    @Prop({ type: [AttachmentSchema] })
    image: Attachment[];
    
    @Prop()
    code: string;
    
    @Prop()
    description: string;
    
    @Prop()
    type: string;
    
    @Prop()
    discountAmount: number;
    
    @Prop()
    minimumCartAmount: number;
    
    @Prop()
    activeForm: Date;
    
    @Prop()
    expireAt: Date;

    @Prop({ type: String })
    startTime: string;
  
    @Prop({ type: String })
    endTime: string;
    
    @Prop({default: true})
    isApprove: boolean;
    
    @Prop({default: true})
    isValid: boolean;
    
}
export const CouponSchema = SchemaFactory.createForClass(Coupon);
