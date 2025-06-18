import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStockDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  currentCapacity?: number;
}
