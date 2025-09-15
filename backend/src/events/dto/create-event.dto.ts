import { IsString, IsNotEmpty, IsDate, IsOptional, IsNumber, IsEnum, IsBoolean, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  category: string;

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
