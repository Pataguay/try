import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { Product } from '../products/entities/product.entity';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item-dto';
import { ClientProfile } from '../user/entities/client-profile.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(ClientProfile)
    private readonly clientProfileRepository: Repository<ClientProfile>,
  ) {}

  private async getClientProfileId(userId: number): Promise<number> {
    const clientProfile = await this.clientProfileRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!clientProfile) {
      throw new NotFoundException(
        `Perfil de cliente não encontrado para o usuário ${userId}`,
      );
    }

    return clientProfile.id;
  }

  async getOrCreateCart(userId: number): Promise<Cart> {
    const clientProfileId = await this.getClientProfileId(userId);

    const cart = await this.cartRepository.findOne({
      where: { clientProfileId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      const newCart = this.cartRepository.create({
        clientProfileId,
        items: [],
        totalValue: 0,
        deliveryFee: 0,
        subtotal: 0,
      });
      return this.cartRepository.save(newCart);
    }

    return cart;
  }

  async addToCart(userId: number, addToCartDto: AddToCartDto): Promise<Cart> {
    const { productId, quantity } = addToCartDto;

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItem = cart.items.find(
      (item) => item.productId === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalPrice = existingItem.unitPrice * existingItem.quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      const newItem = this.cartItemRepository.create({
        cartId: cart.id,
        productId,
        quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity,
      });
      await this.cartItemRepository.save(newItem);
    }

    return this.calculateTotals(cart.id);
  }

  async updateCartItem(
    userId: number,
    itemId: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<Cart> {
    const { quantity } = updateCartItemDto;

    const cart = await this.getOrCreateCart(userId);
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cartId: cart.id },
      relations: ['product'],
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with id ${itemId} not found`);
    }

    cartItem.quantity = quantity;
    cartItem.totalPrice = quantity * cartItem.unitPrice;
    await this.cartItemRepository.save(cartItem);

    return this.calculateTotals(cart.id);
  }

  async removeFromCart(userId: number, itemId: number): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cartId: cart.id },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with id ${itemId} not found`);
    }

    await this.cartItemRepository.remove(cartItem);
    return this.calculateTotals(cart.id);
  }

  async clearCart(userId: number): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    if (cart.items && cart.items.length > 0) {
      // Remover todos os itens com uma abordagem mais robusta
      const itemIds = cart.items.map((item) => item.id);

      // Primeiro remove os itens
      if (itemIds.length > 0) {
        await this.cartItemRepository
          .createQueryBuilder()
          .delete()
          .from(CartItem)
          .where('id IN (:...ids)', { ids: itemIds })
          .execute();
      }

      // Recarrega o carrinho para garantir que está atualizado
      const updatedCart = await this.cartRepository.findOne({
        where: { id: cart.id },
        relations: ['items', 'items.product'],
      });

      if (updatedCart) {
        // Atualiza os totais
        updatedCart.totalValue = 0;
        updatedCart.subtotal = 0;
        updatedCart.deliveryFee = 0;

        return this.cartRepository.save(updatedCart);
      }
    }

    // Se o carrinho não tinha itens ou não foi encontrado após recarregar
    cart.totalValue = 0;
    cart.subtotal = 0;
    cart.deliveryFee = 0;

    return this.cartRepository.save(cart);
  }

  async getCart(userId: number): Promise<Cart> {
    return await this.getOrCreateCart(userId);
  }

  private async calculateTotals(cartId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with id ${cartId} not found`);
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

    const deliveryFee = this.calculateDeliveryFee(subtotal);
    const totalValue = subtotal + deliveryFee;

    cart.subtotal = subtotal;
    cart.deliveryFee = deliveryFee;
    cart.totalValue = totalValue;

    return this.cartRepository.save(cart);
  }

  private calculateDeliveryFee(subtotal: number) {
    if (subtotal >= 50) {
      return 0;
    }
    return 5.0;
  }
}
