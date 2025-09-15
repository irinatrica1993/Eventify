import { IsString, IsOptional, IsDate, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @IsOptional()
  maxParticipants?: number;

  @IsEnum(['active', 'cancelled', 'completed'])
  @IsOptional()
  status?: string;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;
}
