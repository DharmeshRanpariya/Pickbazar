import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Broadcast extends Document  {
    @Prop()
    email: string;
}

export const BroadcastSchema = SchemaFactory.createForClass(Broadcast);
