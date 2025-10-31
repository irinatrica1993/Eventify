import { IsMongoId, IsOptional, IsString, IsEnum } from 'class-validator';
import { ParticipationStatus } from '../schemas/participation.schema';

export class CreateParticipationDto {
  @IsMongoId()
  eventId: string;

  @IsOptional()
  @IsEnum(ParticipationStatus)
  status?: ParticipationStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
