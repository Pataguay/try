import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFavoriteDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  productId: number;
}
