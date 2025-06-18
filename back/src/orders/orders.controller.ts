import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
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
import { GetUser } from '../auth/get-user.decoretor';

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(CreateOrderDto, UpdateOrderDto, UpdateOrderStatusDto)
@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.CLIENT)
  @ApiOperation({
    summary: 'Criar um novo pedido',
    description: 'Cria um novo pedido para um cliente autenticado',
  })
  @ApiConsumes('application/json')
  @ApiBody({
    type: CreateOrderDto,
    description: 'Dados do pedido a ser criado',
    examples: {
      basicOrder: {
        summary: 'Pedido básico',
        description: 'Um exemplo de pedido simples',
        value: {
          paymentMethod: 'PIX',
          notes: 'Entregar no período da tarde, por favor.',
        },
      },
      orderWithoutNotes: {
        summary: 'Pedido sem observações',
        value: {
          paymentMethod: 'CREDIT_CARD',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Pedido criado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para criar pedidos',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  create(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser('id') userId: string,
  ) {
    return this.ordersService.create(createOrderDto, +userId);
  }

  @Get()
  @Roles(UserRole.CLIENT)
  @ApiOperation({
    summary: 'Listar pedidos do cliente',
    description: 'Retorna todos os pedidos do cliente autenticado',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de pedidos do cliente',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para visualizar pedidos',
  })
  findAll(@GetUser('id') userId: string) {
    return this.ordersService.findByClient(+userId);
  }

  @Get('store')
  @Roles(UserRole.PRODUCER)
  @ApiOperation({
    summary: 'Listar pedidos da loja',
    description: 'Retorna todos os pedidos da loja do produtor autenticado',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de pedidos da loja',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para visualizar pedidos da loja',
  })
  findByStore(@GetUser('id') userId: string) {
    return this.ordersService.findByStore(+userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar pedido por ID',
    description: 'Retorna um pedido específico pelo seu ID',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do pedido' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pedido encontrado' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pedido não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para visualizar este pedido',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: string,
    @GetUser('role') userRole: UserRole,
  ) {
    return this.ordersService.findOneOrThrownNotFoundException(id);
  }

  @Patch(':id')
  @Roles(UserRole.CLIENT)
  @ApiOperation({
    summary: 'Atualizar pedido',
    description: 'Atualiza os dados de um pedido existente',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do pedido' })
  @ApiConsumes('application/json')
  @ApiBody({
    type: UpdateOrderDto,
    description: 'Dados para atualização do pedido',
    examples: {
      updateAddress: {
        summary: 'Atualizar endereço de entrega',
        description: 'Alterar o endereço de entrega do pedido',
        value: {
          notes: 'Novo endereço de entrega',
        },
      },
      updateNotes: {
        summary: 'Atualizar observações',
        description: 'Apenas atualizar as observações do pedido',
        value: {
          notes: 'Por favor, entregar no período da manhã.',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pedido atualizado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para atualizar este pedido',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pedido não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @GetUser('id') userId: string,
  ) {
    return this.ordersService.update(id, updateOrderDto, +userId);
  }

  @Patch(':id/status')
  @Roles(UserRole.PRODUCER)
  @ApiOperation({
    summary: 'Atualizar status do pedido',
    description:
      'Atualiza o status de um pedido existente (apenas para produtores)',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do pedido' })
  @ApiConsumes('application/json')
  @ApiBody({
    type: UpdateOrderStatusDto,
    description: 'Novo status do pedido',
    examples: {
      processing: {
        summary: 'Pedido em processamento',
        value: {
          status: 'PROCESSING',
        },
      },
      shipped: {
        summary: 'Pedido enviado',
        value: {
          status: 'SHIPPED',
        },
      },
      delivered: {
        summary: 'Pedido entregue',
        value: {
          status: 'DELIVERED',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status do pedido atualizado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para atualizar status',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pedido não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Status inválido',
  })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @GetUser('id') userId: string,
  ) {
    return this.ordersService.updateStatus(
      id,
      updateOrderStatusDto.status,
      +userId,
    );
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.CLIENT)
  @ApiOperation({
    summary: 'Cancelar pedido',
    description: 'Cancela um pedido existente',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do pedido' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pedido cancelado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para cancelar este pedido',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pedido não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Pedido não pode ser cancelado (já enviado ou entregue)',
  })
  cancelOrder(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: string,
  ) {
    return this.ordersService.cancelOrder(id, +userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.CLIENT)
  @ApiOperation({
    summary: 'Remover pedido',
    description: 'Remove um pedido existente',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do pedido' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Pedido removido com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para remover este pedido',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pedido não encontrado',
  })
  remove(@Param('id', ParseIntPipe) id: number, @GetUser('id') userId: string) {
    return this.ordersService.remove(id, +userId);
  }
}
