import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Like, Repository } from 'typeorm';
import { Store } from '../store/entities/store.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const storeProfile = await this.storeRepository.findOne({
      where: { id: createProductDto.storeId },
    });

    if (!storeProfile) {
      throw new NotFoundException(
        `Store with id ${createProductDto.storeId} not found`,
      );
    }

    const newProduct = this.productRepository.create({
      ...createProductDto,
      store: storeProfile,
    });

    return this.productRepository.save(newProduct);
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOneOrThrowNotFoundException(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['store'],
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const productToUpdate = await this.findOneOrThrowNotFoundException(id);
    Object.assign(productToUpdate, updateProductDto);

    return this.productRepository.save(productToUpdate);
  }

  async remove(id: number): Promise<void> {
    await this.assertThatProductExists(id);
    await this.productRepository.delete(id);
  }

  async assertThatProductExists(id: number): Promise<void> {
    await this.findOneOrThrowNotFoundException(id);
  }

  async findProductsByStoreId(id: number): Promise<Product[]> {
    return await this.productRepository.find({
      where: { store: { id } },
    });
  }

  async findByName(name: string): Promise<Product[]> {
    const products = await this.productRepository.find({
      where: {
        name: Like(`%${name}%`),
      },
    });

    if (products.length === 0) {
      throw new NotFoundException(`No products found with name ${name}`);
    }

    return products;
  }
}
