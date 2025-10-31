import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParticipationsService } from './services/participations.service';
import { ParticipationsController } from './controllers/participations.controller';
import { Participation, ParticipationSchema } from './schemas/participation.schema';
import { Event, EventSchema } from '../events/schemas/event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Participation.name, schema: ParticipationSchema },
      { name: Event.name, schema: EventSchema }
    ])
  ],
  controllers: [ParticipationsController],
  providers: [ParticipationsService],
  exports: [ParticipationsService]
})
export class ParticipationsModule {}
