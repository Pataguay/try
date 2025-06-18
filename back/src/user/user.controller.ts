import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDto } from '../auth/dto/auth.dto';
import { User } from './entities/user.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './entities/enums/user-role';
import { VehicleType } from './entities/enums/vehicle-type';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(RegisterDto, UpdateUserDto)
@Controller('user')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  //@Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Criar um novo usuário',
    description: 'Cria um novo usuário no sistema (restrito a administradores)',
  })
  @ApiConsumes('application/json')
  @ApiBody({
    type: RegisterDto,
    description: 'Dados do usuário a ser criado',
    examples: {
      clientUser: {
        summary: 'Cliente',
        description: 'Exemplo de criação de usuário cliente',
        value: {
          name: 'João Silva',
          email: 'joao.silva@exemplo.com',
          password: 'senha12345',
          role: UserRole.CLIENT,
          cpf: '123.456.789-00',
        },
      },
      producerUser: {
        summary: 'Produtor',
        description: 'Exemplo de criação de usuário produtor',
        value: {
          name: 'Fazenda Orgânica Ltda',
          email: 'contato@fazendaorganica.com',
          password: 'senha54321',
          role: UserRole.PRODUCER,
          cnpj: '12.345.678/0001-90',
        },
      },
      courierUser: {
        summary: 'Entregador',
        description: 'Exemplo de criação de usuário entregador',
        value: {
          name: 'Carlos Entregas',
          email: 'carlos@entregas.com',
          password: 'senha98765',
          role: UserRole.COURIER,
          cpf: '987.654.321-00',
          vehicleType: VehicleType.MOTORCYCLE,
          cnh: '12345678900',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuário criado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'E-mail já cadastrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para criar outros usuários',
  })
  create(@Body() dto: RegisterDto): Promise<User> {
    return this.userService.create(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: 'Retorna um usuário específico pelo seu ID',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'ID do usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário encontrado',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(+id);
  }

  @Get()
  @ApiOperation({
    summary: 'Buscar usuários',
    description: 'Retorna todos os usuários ou busca por email específico',
  })
  @ApiQuery({
    name: 'email',
    type: 'string',
    required: false,
    description: 'Email para busca de usuário específico',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de usuários ou usuário específico encontrado',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado (quando busca por email)',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  getUsers(@Query('email') email: string) {
    if (email) {
      return this.userService.findOneByEmail(email);
    }
    return this.userService.findAll();
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar usuário',
    description: 'Atualiza os dados de um usuário existente',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'ID do usuário' })
  @ApiConsumes('application/json')
  @ApiBody({
    type: UpdateUserDto,
    description: 'Dados para atualização do usuário',
    examples: {
      updateEmail: {
        summary: 'Atualizar email',
        description: 'Atualização apenas do email do usuário',
        value: {
          email: 'novo.email@exemplo.com',
        },
      },
      updatePassword: {
        summary: 'Atualizar senha',
        description: 'Atualização da senha do usuário',
        value: {
          password: 'novaSenha123',
        },
      },
      updateMultipleFields: {
        summary: 'Atualizar vários campos',
        description: 'Atualização de múltiplos campos do usuário',
        value: {
          email: 'novo.email@exemplo.com',
          password: 'novaSenha123',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário atualizado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover usuário',
    description: 'Remove um usuário existente',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'ID do usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário removido com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
