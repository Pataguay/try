import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../user/entities/enums/user-role';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Products')
@ApiExtraModels(CreateProductDto, UpdateProductDto)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Criar um novo produto',
    description: 'Cria um novo produto para a loja do produtor autenticado',
  })
  @ApiConsumes('application/json')
  @ApiBody({
    type: CreateProductDto,
    description: 'Dados do produto a ser criado',
    examples: {
      vegetable: {
        summary: 'Produto vegetal',
        description: 'Exemplo de produto da categoria vegetais',
        value: {
          name: 'Alface Crespa',
          description: 'Alface crespa fresca, cultivada sem agrotóxicos',
          price: 3.5,
          imageUrl: 'https://exemplo.com/imagens/alface.jpg',
          rating: 4.8,
          category: 'Vegetais',
          storeId: 1,
        },
      },
      fruit: {
        summary: 'Produto frutas',
        description: 'Exemplo de produto da categoria frutas',
        value: {
          name: 'Morango Orgânico',
          description: 'Morangos orgânicos cultivados na região serrana',
          price: 12.9,
          imageUrl: 'https://exemplo.com/imagens/morango.jpg',
          rating: 4.5,
          category: 'Frutas',
          storeId: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Produto criado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para criar produtos',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar produtos',
    description: 'Retorna todos os produtos ou filtra por nome',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Nome do produto para filtrar',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de produtos retornada com sucesso',
  })
  findAllOrFindByName(@Query('name') name?: string) {
    if (name) {
      return this.productsService.findByName(name);
    }

    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar produto por ID',
    description: 'Retorna um produto específico pelo seu ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do produto',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Produto encontrado',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Produto não encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findOneOrThrowNotFoundException(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Atualizar produto',
    description: 'Atualiza os dados de um produto existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do produto',
    type: 'number',
    required: true,
  })
  @ApiConsumes('application/json')
  @ApiBody({
    type: UpdateProductDto,
    description: 'Dados para atualização do produto',
    examples: {
      updatePrice: {
        summary: 'Atualizar preço',
        description: 'Atualiza apenas o preço do produto',
        value: {
          price: 4.25,
        },
      },
      updateDetails: {
        summary: 'Atualizar detalhes',
        description: 'Atualiza descrição e imagem do produto',
        value: {
          description: 'Nova descrição atualizada do produto',
          imageUrl: 'https://exemplo.com/imagens/produto-atualizado.jpg',
        },
      },
      updateMultiple: {
        summary: 'Atualização completa',
        description: 'Atualiza múltiplos campos do produto',
        value: {
          name: 'Nome atualizado',
          description: 'Descrição atualizada',
          price: 5.99,
          rating: 4.9,
          category: 'Nova Categoria',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Produto atualizado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para atualizar este produto',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Produto não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Remover produto',
    description: 'Remove um produto existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do produto',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Produto removido com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para remover este produto',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Produto não encontrado',
  })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
