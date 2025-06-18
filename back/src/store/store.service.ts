import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Stock } from '../stock/entities/stock.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const producerProfile = await this.userRepository.findOne({
      where: { id: createStoreDto.producerProfileId },
    });

    if (!producerProfile) {
      throw new NotFoundException(
        `ProducerProfile with id ${createStoreDto.producerProfileId} not found`,
      );
    }

    // Criando o objeto stock corretamente usando repository.create()
    const stock = this.stockRepository.create({
      currentTotalQuantity: createStoreDto.stock?.currentCapacity || 0,
    });

    // Salvando o objeto stock
    const savedStock = await this.stockRepository.save(stock);

    // Criando o objeto store corretamente usando repository.create()
    const newStore = this.storeRepository.create({
      name: createStoreDto.name,
      description: createStoreDto.description,
      producerProfile: producerProfile,
      stock: savedStock,
      rating: 5,
    });

    // Salvando e retornando o store
    return await this.storeRepository.save(newStore);
  }

  findAll(): Promise<Store[]> {
    return this.storeRepository.find({
      relations: ['producerProfile', 'stock', 'stock.inventoryItems'],
    });
  }

  async findOne(id: number): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: [
        'producerProfile',
        'stock',
        'stock.inventoryItems',
        'stock.inventoryItems.product',
      ],
    });

    if (!store) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }

    return store;
  }

  async update(id: number, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOne(id);

    Object.assign(store, updateStoreDto);

    // Update Store's producer profile if provided
    // if (updateStoreDto.stock) {
    //   Object.assign(store.stock, updateStoreDto.stock);
    //   await this.stockService.create(store.stock);
    // }

    return this.storeRepository.save(store);
  }

  async remove(id: number): Promise<void> {
    const store = await this.findOne(id);
    await this.storeRepository.remove(store);
  }

  async getStock(storeId: number): Promise<Stock> {
    const store = await this.findOne(storeId);

    // Calcular e atualizar a quantidade total atual
    const currentTotal = store.stock.calculateCurrentTotalQuantity();
    if (store.stock.currentTotalQuantity !== currentTotal) {
      store.stock.currentTotalQuantity = currentTotal;
      await this.stockRepository.save(store.stock);
    }

    return store.stock;
  }
}
