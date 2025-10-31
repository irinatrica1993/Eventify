import { IsOptional, IsMongoId, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ParticipationStatus } from '../schemas/participation.schema';

export class QueryParticipationsDto {
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsOptional()
  @IsMongoId()
  eventId?: string;

  @IsOptional()
  @IsEnum(ParticipationStatus)
  status?: ParticipationStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
