import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { UserService } from '../user/user.service';
import { ClientProfile } from '../user/entities/client-profile.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    private readonly productService: ProductsService,
    private readonly userService: UserService,
  ) {}

  async addFavorite(
    createFavoriteDto: CreateFavoriteDto,
    userId: number,
  ): Promise<Favorite> {
    await this.productService.findOneOrThrowNotFoundException(
      createFavoriteDto.productId,
    );

    const clientProfileId =
      await this.userService.findClientProfileByUserId(userId);

    await this.validateIfProductIsAlreadyFavorite(
      clientProfileId,
      createFavoriteDto,
    );

    const newFavorite = this.favoriteRepository.create({
      ...createFavoriteDto,
      clientProfileId: clientProfileId.id,
    });

    return this.favoriteRepository.save(newFavorite);
  }

  async getUserFavoriteProducts(userId: number) {
    const clientProfileId =
      await this.userService.findClientProfileByUserId(userId);

    return this.favoriteRepository.find({
      where: { clientProfileId: clientProfileId.id },
      relations: ['product'],
    });
  }

  async removeFavorite(id: number): Promise<void> {
    await this.assertThatFavoriteExists(id);

    await this.favoriteRepository.delete(id);
  }

  async assertThatFavoriteExists(id: number): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { id: id },
    });

    if (!favorite) {
      throw new NotFoundException(`Favorite with id ${id} not found`);
    }
  }

  private async validateIfProductIsAlreadyFavorite(
    clientProfileId: ClientProfile,
    createFavoriteDto: CreateFavoriteDto,
  ) {
    const existingFavorite = await this.favoriteRepository.findOne({
      where: {
        clientProfileId: clientProfileId.id,
        productId: createFavoriteDto.productId,
      },
    });

    if (existingFavorite) {
      throw new ConflictException('Product is already in favorites');
    }
  }
}
