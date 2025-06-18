import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { UpdateStockDto } from './dto/update-stock.dto';
import { CreateStockDto } from './dto/create-stock.dto';
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
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../user/entities/enums/user-role';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Stock')
@ApiExtraModels(CreateStockDto, UpdateStockDto)
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  // O endpoint create está comentado, mas mantive sua documentação caso seja necessário descomentá-lo no futuro
  // @Post()
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles(UserRole.PRODUCER)
  // @ApiBearerAuth('JWT-auth')
  // @ApiOperation({
  //   summary: 'Criar estoque',
  //   description: 'Cria um novo estoque para uma loja',
  // })
  // @ApiConsumes('application/json')
  // @ApiBody({
  //   type: CreateStockDto,
  //   description: 'Dados do estoque a ser criado',
  //   examples: {
  //     emptyStock: {
  //       summary: 'Estoque vazio',
  //       value: {},
  //     },
  //     stockWithCapacity: {
  //       summary: 'Estoque com capacidade inicial',
  //       value: {
  //         currentCapacity: 100,
  //       },
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: HttpStatus.CREATED,
  //   description: 'Estoque criado com sucesso',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Usuário não autenticado',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Usuário não tem permissão para criar estoque',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Dados inválidos',
  // })
  // create(@Body() createStockDto: CreateStockDto) {
  //   return this.stockService.create(createStockDto);
  // }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os estoques',
    description: 'Retorna todos os estoques cadastrados no sistema',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de estoques retornada com sucesso',
  })
  findAll() {
    return this.stockService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar estoque por ID',
    description: 'Retorna um estoque específico pelo seu ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do estoque',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estoque encontrado',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Estoque não encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Atualizar estoque',
    description: 'Atualiza os dados de um estoque existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do estoque',
    type: 'number',
    required: true,
  })
  @ApiConsumes('application/json')
  @ApiBody({
    type: UpdateStockDto,
    description: 'Dados para atualização do estoque',
    examples: {
      updateCapacity: {
        summary: 'Atualizar capacidade',
        description: 'Atualiza a capacidade atual do estoque',
        value: {
          currentCapacity: 150,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estoque atualizado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para atualizar este estoque',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Estoque não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    return this.stockService.update(+id, updateStockDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PRODUCER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Remover estoque',
    description: 'Remove um estoque existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do estoque',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estoque removido com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para remover este estoque',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Estoque não encontrado',
  })
  remove(@Param('id') id: string) {
    return this.stockService.remove(+id);
  }
}
