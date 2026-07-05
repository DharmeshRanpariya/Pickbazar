import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class StateAndCity extends Document {
  @Prop({ required: true, unique: true })
  state: string;

  @Prop({ type: Object })
  cities: Record<string, string[]>;
}

export const StateAndCitySchema = SchemaFactory.createForClass(StateAndCity);
