import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../user/entities/enums/user-role';
import { Roles } from '../auth/roles.decorator';
import { ProductsService } from '../products/products.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Store')
@ApiExtraModels(CreateStoreDto, UpdateStoreDto)
@Controller('store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Criar uma nova loja',
    description: 'Cria uma nova loja para o produtor autenticado',
  })
  @ApiConsumes('application/json')
  @ApiBody({
    type: CreateStoreDto,
    description: 'Dados da loja a ser criada',
    examples: {
      storeExample: {
        summary: 'Exemplo de loja',
        description: 'Dados básicos para criação de loja',
        value: {
          name: 'Fazenda Orgânica',
          description: 'Produtos orgânicos cultivados com amor',
          producerProfileId: 1,
        },
      },
      storeWithStockExample: {
        summary: 'Loja com estoque inicial',
        description: 'Criar loja com configuração inicial de estoque',
        value: {
          name: 'Horta Feliz',
          description: 'Produtos frescos direto da horta',
          producerProfileId: 1,
          stock: {
            name: 'Estoque principal',
            description: 'Estoque inicial da Horta Feliz',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Loja criada com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para criar lojas',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas as lojas',
    description: 'Retorna uma lista com todas as lojas cadastradas',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de lojas retornada com sucesso',
  })
  findAll() {
    return this.storeService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter loja por ID',
    description: 'Retorna os dados de uma loja específica',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da loja',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Loja encontrada com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Loja não encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(+id);
  }

  @Get(':storeId/products')
  @ApiOperation({
    summary: 'Listar produtos de uma loja',
    description: 'Retorna todos os produtos disponíveis em uma loja específica',
  })
  @ApiParam({
    name: 'storeId',
    description: 'ID da loja',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de produtos retornada com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Loja não encontrada',
  })
  async findProductsByStoreId(@Param('storeId') id: string) {
    return this.productsService.findProductsByStoreId(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Atualizar loja',
    description: 'Atualiza os dados de uma loja específica',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da loja',
    type: 'number',
    required: true,
  })
  @ApiConsumes('application/json')
  @ApiBody({
    type: UpdateStoreDto,
    description: 'Dados para atualização da loja',
    examples: {
      updateInfoExample: {
        summary: 'Atualizar informações básicas',
        description: 'Atualizar nome e descrição da loja',
        value: {
          name: 'Novo Nome da Loja',
          description: 'Nova descrição da loja atualizada',
        },
      },
      updateRatingExample: {
        summary: 'Atualizar avaliação',
        description: 'Atualizar apenas a avaliação da loja',
        value: {
          rating: 4.5,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Loja atualizada com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para atualizar esta loja',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Loja não encontrada',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(+id, updateStoreDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Remover loja',
    description: 'Remove uma loja específica',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da loja',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Loja removida com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para remover esta loja',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Loja não encontrada',
  })
  remove(@Param('id') id: string) {
    return this.storeService.remove(+id);
  }

  @Get(':id/stock')
  @ApiOperation({
    summary: 'Obter estoque da loja',
    description: 'Retorna informações do estoque de uma loja específica',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da loja',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estoque encontrado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Loja ou estoque não encontrado',
  })
  getStock(@Param('id') id: number) {
    return this.storeService.getStock(+id);
  }
}
