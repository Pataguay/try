import { PartialType } from '@nestjs/mapped-types';
import { CreateStoreDto } from './create-store.dto';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {
  @IsOptional()
  @IsString({ message: 'O nome deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio se fornecido.' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser um texto.' })
  @IsNotEmpty({ message: 'A descrição não pode estar vazia se fornecida.' })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'A avaliação deve ser um número.' })
  @Min(0, { message: 'A avaliação deve ser no mínimo 0.' })
  @Max(5, { message: 'A avaliação deve ser no máximo 5.' })
  rating?: number;

  @IsOptional()
  @IsNumber({}, { message: 'O ID do perfil do produtor deve ser um número.' })
  @IsNotEmpty({
    message: 'O ID do perfil do produtor não pode estar vazio se fornecido.',
  })
  producerProfileId?: number;
}
