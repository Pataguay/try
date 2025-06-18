import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Repository } from 'typeorm';
import { CreateStoreDto } from '../store/dto/create-store.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  // async create(store: CreateStoreDto): Promise<Stock> {
  //   const newStock = this.stockRepository.create(
  //     store.stock || {
  //       store.stock,
  //       currentTotalQuantity: 0,
  //     },
  //   );
  //   return await this.stockRepository.save(newStock);
  // }

  async findAll(): Promise<Stock[]> {
    return await this.stockRepository.find();
  }

  async findOne(id: number): Promise<Stock> {
    const stock = await this.stockRepository.findOne({
      where: { id },
      relations: ['store'],
    });

    if (!stock) {
      throw new NotFoundException(`Stock with id ${id} not found`);
    }

    return stock;
  }

  async update(id: number, updateStockDto: UpdateStockDto): Promise<Stock> {
    const stockToUpdate = await this.findOne(id);
    Object.assign(stockToUpdate, updateStockDto);
    return await this.stockRepository.save(stockToUpdate);
  }

  async remove(id: number) {
    await this.assertThatStockExists(id);
    await this.stockRepository.delete(id);
  }

  private async assertThatStockExists(id: number) {
    await this.findOne(id);
  }
}
