import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { Repository } from 'typeorm';
import { Stock } from '../stock/entities/stock.entity';
import { Product } from '../products/entities/product.entity';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';

@Injectable()
export class InventoryItemsService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryItemRepository: Repository<InventoryItem>,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async addProductToStock(
    storeId: number,
    createInventoryItemDto: CreateInventoryItemDto,
  ): Promise<InventoryItem> {
    const stock = await this.stockRepository.findOne({
      where: { store: { id: storeId } },
    });

    if (!stock) {
      throw new NotFoundException(
        `Stock for store with ID ${storeId} not found`,
      );
    }

    const product = await this.productRepository.findOne({
      where: { id: createInventoryItemDto.productId },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${createInventoryItemDto.productId} not found`,
      );
    }

    // Verificar se o produto já existe no stock
    const existingItem = await this.inventoryItemRepository.findOne({
      where: {
        stock: { id: stock.id },
        product: { id: createInventoryItemDto.productId },
      },
    });

    if (existingItem) {
      throw new BadRequestException('Product already exists in this stock');
    }

    const inventoryItem = this.inventoryItemRepository.create({
      ...createInventoryItemDto,
      stock,
      product,
    });

    return this.inventoryItemRepository.save(inventoryItem);
  }

  async getStockInventory(storeId: number): Promise<InventoryItem[]> {
    return this.inventoryItemRepository.find({
      where: { stock: { store: { id: storeId } } },
      relations: ['product', 'stock'],
      order: { product: { name: 'ASC' } },
    });
  }

  async getInventoryItemByProduct(
    storeId: number,
    productId: number,
  ): Promise<InventoryItem> {
    const item = await this.inventoryItemRepository.findOne({
      where: {
        stock: { store: { id: storeId } },
        product: { id: productId },
      },
      relations: ['product', 'stock'],
    });

    if (!item) {
      throw new NotFoundException('Product not found in this store inventory');
    }

    return item;
  }

  async updateInventoryItem(
    storeId: number,
    productId: number,
    updateDto: UpdateInventoryItemDto,
  ): Promise<InventoryItem> {
    const inventoryItem = await this.getInventoryItemByProduct(
      storeId,
      productId,
    );

    Object.assign(inventoryItem, updateDto);

    // Se a quantidade foi atualizada, atualizar a data de reabastecimento
    if (
      updateDto.quantity !== undefined &&
      updateDto.quantity > inventoryItem.quantity
    ) {
      inventoryItem.restockedAt = new Date();
    }

    return this.inventoryItemRepository.save(inventoryItem);
  }

  async decreaseStock(
    storeId: number,
    productId: number,
    quantity: number,
  ): Promise<InventoryItem> {
    const inventoryItem = await this.getInventoryItemByProduct(
      storeId,
      productId,
    );

    if (inventoryItem.quantity < quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${inventoryItem.quantity}, Requested: ${quantity}`,
      );
    }

    inventoryItem.quantity -= quantity;
    return this.inventoryItemRepository.save(inventoryItem);
  }

  async increaseStock(
    storeId: number,
    productId: number,
    quantity: number,
  ): Promise<InventoryItem> {
    const inventoryItem = await this.getInventoryItemByProduct(
      storeId,
      productId,
    );

    inventoryItem.quantity += quantity;

    return this.inventoryItemRepository.save(inventoryItem);
  }

  async removeProductFromStock(
    storeId: number,
    productId: number,
  ): Promise<void> {
    const inventoryItem = await this.getInventoryItemByProduct(
      storeId,
      productId,
    );
    await this.inventoryItemRepository.remove(inventoryItem);
  }

  async getOutOfStockItems(storeId: number): Promise<InventoryItem[]> {
    return this.inventoryItemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.product', 'product')
      .leftJoinAndSelect('item.stock', 'stock')
      .leftJoinAndSelect('stock.store', 'store')
      .where('store.id = :storeId', { storeId })
      .andWhere('item.quantity = 0')
      .getMany();
  }

  async getStockSummary(storeId: number): Promise<{
    totalProducts: number;
    totalQuantity: number;
    outOfStockProducts: number;
  }> {
    const items = await this.getStockInventory(storeId);

    return {
      totalProducts: items.length,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
      outOfStockProducts: items.filter((item) => item.quantity === 0).length,
    };
  }
}
