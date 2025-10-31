import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Event } from '../../events/schemas/event.schema';

export type ParticipationDocument = Participation & Document;

export enum ParticipationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

@Schema({ timestamps: true })
export class Participation {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User | MongooseSchema.Types.ObjectId | string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: true })
  event: Event | MongooseSchema.Types.ObjectId | string;

  @Prop({ 
    type: String, 
    enum: ParticipationStatus, 
    default: ParticipationStatus.CONFIRMED 
  })
  status: ParticipationStatus;

  @Prop()
  notes: string;
}

export const ParticipationSchema = SchemaFactory.createForClass(Participation);

// Indice composto per garantire che un utente possa partecipare a un evento una sola volta
ParticipationSchema.index({ user: 1, event: 1 }, { unique: true });
