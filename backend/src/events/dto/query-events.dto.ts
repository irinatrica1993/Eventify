import { IsOptional, IsString, IsEnum, IsNumber, Min, Max, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryEventsDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDateFrom?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDateTo?: Date;

  @IsOptional()
  @IsEnum(['active', 'cancelled', 'completed'])
  status?: string;

  @IsOptional()
  @IsString()
  organizer?: string;
}
