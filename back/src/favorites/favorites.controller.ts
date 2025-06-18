import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { GetUser } from '../auth/get-user.decoretor';
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
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../user/entities/enums/user-role';

@ApiTags('Favorites')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(CreateFavoriteDto, UpdateFavoriteDto)
@Controller('favorites')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.CLIENT)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Adicionar produto aos favoritos',
    description:
      'Adiciona um produto à lista de favoritos do cliente autenticado',
  })
  @ApiConsumes('application/json')
  @ApiBody({
    type: CreateFavoriteDto,
    description: 'Dados do produto a ser adicionado aos favoritos',
    examples: {
      basicFavorite: {
        summary: 'Favorito básico',
        description: 'Um exemplo de favorito simples',
        value: {
          productId: 1,
        },
      },
      multipleFavorites: {
        summary: 'Múltiplos favoritos',
        description: 'Exemplo de adicionar vários produtos aos favoritos',
        value: {
          productId: 5,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Produto adicionado aos favoritos com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para adicionar favoritos',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  addFavorite(
    @Body() createFavoriteDto: CreateFavoriteDto,
    @GetUser('id') userId: string,
  ) {
    return this.favoritesService.addFavorite(createFavoriteDto, +userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar produtos favoritos',
    description: 'Retorna todos os produtos favoritos do cliente autenticado',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de produtos favoritos',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para visualizar favoritos',
  })
  getUserFavoriteProducts(@GetUser('id') userId: string) {
    return this.favoritesService.getUserFavoriteProducts(+userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remover produto dos favoritos',
    description: 'Remove um produto da lista de favoritos do cliente',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do favorito' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Produto removido dos favoritos com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para remover favoritos',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Favorito não encontrado',
  })
  remove(@Param('id', ParseIntPipe) favoriteId: number) {
    return this.favoritesService.removeFavorite(favoriteId);
  }
}
