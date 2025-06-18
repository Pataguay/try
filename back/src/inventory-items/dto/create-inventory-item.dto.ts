import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInventoryItemDto {
  @IsNumber()
  @Type(() => Number)
  productId: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  quantity: number;
}
