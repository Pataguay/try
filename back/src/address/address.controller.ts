import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../user/entities/enums/user-role';
import { Roles } from 'src/auth/roles.decorator';
import { GetUser } from '../auth/get-user.decoretor';

@ApiTags('Address')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(CreateAddressDto, UpdateAddressDto)
@Controller('address')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.CLIENT)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo endereço',
    description: 'Cria um novo endereço para o cliente autenticado',
  })
  @ApiConsumes('application/json')
  @ApiBody({
    type: CreateAddressDto,
    description: 'Dados do endereço a ser criado',
    examples: {
      residentialAddress: {
        summary: 'Endereço residencial',
        description: 'Exemplo de endereço residencial completo',
        value: {
          street: 'Rua das Flores',
          number: '123',
          complement: 'Apto 45, Bloco B',
          city: 'São Paulo',
          state: 'SP',
          postalCode: '01234-567',
        },
      },
      commercialAddress: {
        summary: 'Endereço comercial',
        description: 'Exemplo de endereço comercial sem complemento',
        value: {
          street: 'Avenida Paulista',
          number: '1000',
          city: 'São Paulo',
          state: 'SP',
          postalCode: '01310-100',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Endereço criado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para criar endereços',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  create(
    @Body() createAddressDto: CreateAddressDto,
    @GetUser('id') userId: string,
  ) {
    return this.addressService.create(createAddressDto, +userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Buscar endereço do usuário',
    description: 'Retorna o endereço do cliente autenticado',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Endereço encontrado',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Endereço não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para acessar este recurso',
  })
  findOne(@GetUser('id') userId: string) {
    return this.addressService.findOne(+userId);
  }

  @Patch()
  @ApiOperation({
    summary: 'Atualizar endereço',
    description: 'Atualiza o endereço do cliente autenticado',
  })
  @ApiConsumes('application/json')
  @ApiBody({
    type: UpdateAddressDto,
    description: 'Dados para atualização do endereço',
    examples: {
      updateFullAddress: {
        summary: 'Atualização completa',
        description: 'Atualização de todos os campos do endereço',
        value: {
          street: 'Rua Nova',
          number: '456',
          complement: 'Casa',
          city: 'Rio de Janeiro',
          state: 'RJ',
          postalCode: '22000-000',
        },
      },
      updatePartialAddress: {
        summary: 'Atualização parcial',
        description: 'Atualização apenas de alguns campos',
        value: {
          complement: 'Fundos',
          number: '789',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Endereço atualizado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para atualizar endereços',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Endereço não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  update(
    @GetUser('id') userId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressService.update(updateAddressDto, +userId);
  }
}
