import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ParticipationStatus } from '../schemas/participation.schema';

export class UpdateParticipationDto {
  @IsOptional()
  @IsEnum(ParticipationStatus)
  status?: ParticipationStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
