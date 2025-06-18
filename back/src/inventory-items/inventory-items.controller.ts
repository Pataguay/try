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
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { InventoryItemsService } from './inventory-items.service';
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Inventory Items')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(CreateInventoryItemDto, UpdateInventoryItemDto)
@Controller('store/:storeId/inventory-items')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.PRODUCER)
export class InventoryItemsController {
  constructor(private readonly inventoryItemsService: InventoryItemsService) {}

  @Post()
  @ApiOperation({
    summary: 'Adicionar produto ao estoque',
    description: 'Adiciona um produto ao estoque da loja especificada',
  })
  @ApiParam({
    name: 'storeId',
    type: 'number',
    description: 'ID da loja',
    required: true,
  })
  @ApiConsumes('application/json')
  @ApiBody({
    type: CreateInventoryItemDto,
    description: 'Dados do item de estoque a ser adicionado',
    examples: {
      newItem: {
        summary: 'Novo item de estoque',
        description: 'Adiciona um produto ao estoque com quantidade específica',
        value: {
          productId: 1,
          quantity: 50,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Produto adicionado ao estoque com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para gerenciar o estoque',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Loja ou produto não encontrado',
  })
  addProduct(
    @Param('storeId') storeId: string,
    @Body() createInventoryItemDto: CreateInventoryItemDto,
  ) {
    return this.inventoryItemsService.addProductToStock(
      +storeId,
      createInventoryItemDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Listar inventário da loja',
    description: 'Retorna todos os itens do inventário da loja especificada',
  })
  @ApiParam({
    name: 'storeId',
    type: 'number',
    description: 'ID da loja',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inventário retornado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para visualizar o inventário',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Loja não encontrada',
  })
  getInventory(@Param('storeId') storeId: string) {
    return this.inventoryItemsService.getStockInventory(+storeId);
  }

  @Get('summary')
  @ApiOperation({
    summary: 'Obter resumo do estoque',
    description: 'Retorna um resumo do estoque da loja especificada',
  })
  @ApiParam({
    name: 'storeId',
    type: 'number',
    description: 'ID da loja',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resumo do estoque retornado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Usuário não tem permissão para visualizar o resumo do estoque',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Loja não encontrada',
  })
  getStockSummary(@Param('storeId') storeId: string) {
    return this.inventoryItemsService.getStockSummary(+storeId);
  }

  @Get('out-of-stock')
  @ApiOperation({
    summary: 'Listar produtos em falta',
    description: 'Retorna todos os produtos que estão com estoque zerado',
  })
  @ApiParam({
    name: 'storeId',
    type: 'number',
    description: 'ID da loja',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de produtos em falta retornada com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para visualizar produtos em falta',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Loja não encontrada',
  })
  getOutOfStockItems(@Param('storeId') storeId: string) {
    return this.inventoryItemsService.getOutOfStockItems(+storeId);
  }

  @Get('products/:productId')
  @ApiOperation({
    summary: 'Obter item do inventário por produto',
    description: 'Retorna informações de estoque para um produto específico',
  })
  @ApiParam({
    name: 'storeId',
    type: 'number',
    description: 'ID da loja',
    required: true,
  })
  @ApiParam({
    name: 'productId',
    type: 'number',
    description: 'ID do produto',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Item de inventário encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para acessar este recurso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Loja ou produto não encontrado no inventário',
  })
  getInventoryItemByProduct(
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
  ) {
    return this.inventoryItemsService.getInventoryItemByProduct(
      +storeId,
      +productId,
    );
  }

  @Patch('products/:productId')
  @ApiOperation({
    summary: 'Atualizar item do inventário',
    description:
      'Atualiza as informações de estoque para um produto específico',
  })
  @ApiParam({
    name: 'storeId',
    type: 'number',
    description: 'ID da loja',
    required: true,
  })
  @ApiParam({
    name: 'productId',
    type: 'number',
    description: 'ID do produto',
    required: true,
  })
  @ApiConsumes('application/json')
  @ApiBody({
    type: UpdateInventoryItemDto,
    description: 'Dados para atualização do item de inventário',
    examples: {
      updateQuantity: {
        summary: 'Atualizar quantidade',
        description: 'Atualiza a quantidade em estoque para o produto',
        value: {
          quantity: 75,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Item de inventário atualizado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para atualizar itens do inventário',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Loja ou produto não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  updateInventoryItem(
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
    @Body() updateInventoryItemDto: UpdateInventoryItemDto,
  ) {
    return this.inventoryItemsService.updateInventoryItem(
      +storeId,
      +productId,
      updateInventoryItemDto,
    );
  }

  @Patch('products/:productId/decrease')
  @ApiOperation({
    summary: 'Diminuir quantidade em estoque',
    description: 'Reduz a quantidade disponível de um produto no estoque',
  })
  @ApiParam({
    name: 'storeId',
    type: 'number',
    description: 'ID da loja',
    required: true,
  })
  @ApiParam({
    name: 'productId',
    type: 'number',
    description: 'ID do produto',
    required: true,
  })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'Quantidade a ser reduzida',
    schema: {
      type: 'object',
      properties: {
        quantity: {
          type: 'number',
          example: 5,
          description: 'Quantidade a ser removida do estoque',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estoque reduzido com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para alterar o estoque',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Loja ou produto não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Quantidade inválida ou estoque insuficiente',
  })
  decreaseStock(
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.inventoryItemsService.decreaseStock(
      +storeId,
      +productId,
      quantity,
    );
  }

  @Patch('products/:productId/increase')
  @ApiOperation({
    summary: 'Aumentar quantidade em estoque',
    description: 'Aumenta a quantidade disponível de um produto no estoque',
  })
  @ApiParam({
    name: 'storeId',
    type: 'number',
    description: 'ID da loja',
    required: true,
  })
  @ApiParam({
    name: 'productId',
    type: 'number',
    description: 'ID do produto',
    required: true,
  })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'Quantidade a ser adicionada',
    schema: {
      type: 'object',
      properties: {
        quantity: {
          type: 'number',
          example: 10,
          description: 'Quantidade a ser adicionada ao estoque',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estoque aumentado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para alterar o estoque',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Loja ou produto não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Quantidade inválida',
  })
  increaseStock(
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.inventoryItemsService.increaseStock(
      +storeId,
      +productId,
      quantity,
    );
  }

  @Delete('products/:productId')
  @ApiOperation({
    summary: 'Remover produto do estoque',
    description: 'Remove um produto do estoque da loja',
  })
  @ApiParam({
    name: 'storeId',
    type: 'number',
    description: 'ID da loja',
    required: true,
  })
  @ApiParam({
    name: 'productId',
    type: 'number',
    description: 'ID do produto',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Produto removido do estoque com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para remover produtos do estoque',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Loja ou produto não encontrado',
  })
  removeProduct(
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
  ) {
    return this.inventoryItemsService.removeProductFromStock(
      +storeId,
      +productId,
    );
  }
}
