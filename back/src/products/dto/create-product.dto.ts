import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'O nome deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  name: string;

  @IsString({ message: 'A descrição deve ser um texto.' })
  @IsNotEmpty({ message: 'A descrição não pode estar vazia.' })
  description: string;

  @IsNumber({}, { message: 'O preço deve ser um número.' })
  @IsNotEmpty({ message: 'O preço não pode estar vazio.' })
  @IsPositive({ message: 'O preço deve ser um valor positivo.' })
  price: number;

  @IsUrl({}, { message: 'A URL da imagem é inválida.' })
  @IsNotEmpty({ message: 'A URL da imagem não pode estar vazia.' })
  imageUrl: string;

  @IsNumber({}, { message: 'A avaliação deve ser um número.' })
  @IsNotEmpty({ message: 'A avaliação não pode estar vazia.' })
  @Min(0, { message: 'A avaliação deve ser no mínimo 0.' })
  @Max(5, { message: 'A avaliação deve ser no máximo 5.' })
  rating?: number;

  @IsString({ message: 'A categoria deve ser um texto.' })
  @IsNotEmpty({ message: 'A categoria não pode estar vazia.' })
  category?: string;

  @IsNumber({}, { message: 'O ID da loja deve ser um número.' })
  @IsNotEmpty({ message: 'O ID da loja não pode estar vazio.' })
  storeId: number;
}
