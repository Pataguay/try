import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString({ message: 'A rua deve ser um texto.' })
  @IsNotEmpty({ message: 'A rua não pode estar vazia.' })
  street: string;

  @IsString({ message: 'O número deve ser um texto.' })
  @IsNotEmpty({ message: 'O número não pode estar vazio.' })
  number: string;

  @IsString({ message: 'O complemento deve ser um texto.' })
  @IsOptional()
  complement?: string;

  @IsString({ message: 'A cidade deve ser um texto.' })
  @IsNotEmpty({ message: 'A cidade não pode estar vazia.' })
  city: string;

  @IsString({ message: 'O estado deve ser um texto.' })
  @IsNotEmpty({ message: 'O estado não pode estar vazio.' })
  state: string;

  @IsString({ message: 'O CEP deve ser um texto.' })
  @IsNotEmpty({ message: 'O CEP não pode estar vazio.' })
  postalCode: string;

  @IsOptional()
  clientProfileId?: number;
}
