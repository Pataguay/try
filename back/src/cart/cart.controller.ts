import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../user/entities/enums/user-role';
import { CartService } from './cart.service';
import { GetUser } from '../auth/get-user.decoretor';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item-dto';

@ApiTags('Cart')
@ApiBearerAuth('JWT-auth')
@Controller('cart')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.CLIENT)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Obter carrinho do cliente' })
  @ApiResponse({ status: 200, description: 'Carrinho retornado com sucesso' })
  async getCart(@GetUser('id') userId: string) {
    return this.cartService.getCart(+userId);
  }

  @Post('add')
  @ApiOperation({ summary: 'Adicionar produto ao carrinho' })
  @ApiResponse({ status: 201, description: 'Produto adicionado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async addToCart(
    @GetUser('id') userId: string,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addToCart(+userId, addToCartDto);
  }

  @Patch('item/:itemId')
  @ApiOperation({ summary: 'Atualizar quantidade de item no carrinho' })
  @ApiResponse({ status: 200, description: 'Item atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async updateCartItem(
    @GetUser('id') userId: string,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(+userId, +itemId, updateCartItemDto);
  }

  @Delete('item/:itemId')
  @ApiOperation({ summary: 'Remover item do carrinho' })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async removeFromCart(
    @GetUser('id') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeFromCart(+userId, +itemId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Limpar carrinho' })
  @ApiResponse({ status: 200, description: 'Carrinho limpo com sucesso' })
  async clearCart(@GetUser('id') userId: string) {
    return this.cartService.clearCart(+userId);
  }
}
