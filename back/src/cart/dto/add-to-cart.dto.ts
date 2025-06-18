// create-cart.dto.ts
import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({
    description: 'ID do produto a ser adicionado ao carrinho',
    example: 1,
  })
  @IsNotEmpty({ message: 'O ID do produto é obrigatório' })
  @IsNumber({}, { message: 'O ID do produto deve ser um número' })
  @IsPositive({ message: 'O ID do produto deve ser um número positivo' })
  productId: number;

  @ApiProperty({
    description: 'Quantidade do produto',
    example: 2,
    minimum: 1,
  })
  @IsNotEmpty({ message: 'A quantidade do produto é obrigatória' })
  @IsNumber({}, { message: 'A quantidade deve ser um número' })
  @Min(1, { message: 'A quantidade mínima deve ser 1' })
  quantity: number;
}
