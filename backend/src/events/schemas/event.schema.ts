import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  organizer: User | MongooseSchema.Types.ObjectId | string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }], default: [] })
  participants: (User | MongooseSchema.Types.ObjectId | string)[];

  @Prop({ required: true })
  category: string;

  @Prop()
  imageUrl: string;

  @Prop({ required: true, default: 0 })
  maxParticipants: number;

  @Prop({ required: true, enum: ['active', 'cancelled', 'completed'], default: 'active' })
  status: string;

  @Prop({ default: false })
  isPrivate: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);
