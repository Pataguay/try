import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateStockDto } from '../../stock/dto/create-stock.dto';

export class CreateStoreDto {
  @IsString({ message: 'O nome deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  name: string;

  @IsString({ message: 'A descrição deve ser um texto.' })
  @IsNotEmpty({ message: 'A descrição não pode estar vazia.' })
  description: string;

  @IsNumber({}, { message: 'O ID do perfil do produtor deve ser um número.' })
  @IsNotEmpty({ message: 'O ID do perfil do produtor não pode estar vazio.' })
  producerProfileId: number;

  @IsOptional()
  stock?: CreateStockDto;
}
