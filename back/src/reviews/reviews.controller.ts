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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
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
import { UserRole } from '../user/entities/enums/user-role';
import { GetUser } from '../auth/get-user.decoretor';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Reviews')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(CreateReviewDto, UpdateReviewDto)
@Controller('reviews')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.CLIENT)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar uma nova avaliação',
    description: 'Cria uma nova avaliação para um produto por um cliente autenticado',
  })
  @ApiConsumes('application/json')
  @ApiBody({
    type: CreateReviewDto,
    description: 'Dados da avaliação a ser criada',
    examples: {
      basicReview: {
        summary: 'Avaliação básica',
        description: 'Um exemplo de avaliação simples',
        value: {
          orderId: 1,
          rating: 5,
          comment: 'Produto excelente, muito satisfeito com a qualidade!',
        },
      },
      reviewWithoutComment: {
        summary: 'Avaliação sem comentário',
        value: {
          orderId: 1,
          rating: 4,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Avaliação criada com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para criar avaliações',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  create(
    @Body() createReviewDto: CreateReviewDto,
    @GetUser('id') userId: string,
  ) {
    return this.reviewsService.create(createReviewDto, +userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar avaliações do usuário',
    description: 'Retorna todas as avaliações feitas pelo usuário autenticado',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de avaliações do usuário',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para visualizar avaliações',
  })
  getUserReviews(@GetUser('id') id: string) {
    return this.reviewsService.getUserReviews(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar avaliação',
    description: 'Atualiza os dados de uma avaliação existente',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da avaliação' })
  @ApiConsumes('application/json')
  @ApiBody({
    type: UpdateReviewDto,
    description: 'Dados para atualização da avaliação',
    examples: {
      updateRating: {
        summary: 'Atualizar nota',
        description: 'Alterar a nota da avaliação',
        value: {
          rating: 4,
        },
      },
      updateComment: {
        summary: 'Atualizar comentário',
        description: 'Apenas atualizar o comentário da avaliação',
        value: {
          comment: 'Produto muito bom, mas poderia melhorar na embalagem.',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Avaliação atualizada com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para atualizar esta avaliação',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Avaliação não encontrada',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  update(
    @Param('id', ParseIntPipe) reviewId: number,
    @GetUser('id') userId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(reviewId, +userId, updateReviewDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remover avaliação',
    description: 'Remove uma avaliação existente',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'ID da avaliação' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Avaliação removida com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para remover esta avaliação',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Avaliação não encontrada',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.remove(id);
  }
}
