import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ParticipationDto {
  @IsMongoId()
  @IsNotEmpty()
  eventId: string;
}
