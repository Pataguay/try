import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '../user/entities/enums/user-role';
import { VehicleType } from '../user/entities/enums/vehicle-type';

@ApiTags('Autenticação')
@ApiExtraModels(RegisterDto, LoginDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: 'Registrar um novo usuário',
    description: 'Cria uma nova conta de usuário no sistema',
  })
  @ApiConsumes('application/json')
  @ApiBody({
    type: RegisterDto,
    description: 'Dados para registro de novo usuário',
    examples: {
      clientExample: {
        summary: 'Cliente',
        description: 'Exemplo de registro de cliente',
        value: {
          name: 'Maria Silva',
          email: 'maria.silva@exemplo.com',
          password: 'senha12345',
          role: UserRole.CLIENT,
          cpf: '123.456.789-00',
        },
      },
      producerExample: {
        summary: 'Produtor Rural',
        description: 'Exemplo de registro de produtor rural',
        value: {
          name: 'Sítio Boa Colheita',
          email: 'contato@sitioboa.com',
          password: 'senha54321',
          role: UserRole.PRODUCER,
          cnpj: '12.345.678/0001-90',
        },
      },
      courierExample: {
        summary: 'Entregador',
        description: 'Exemplo de registro de entregador',
        value: {
          name: 'Pedro Entregas',
          email: 'pedro@entregas.com',
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
    description: 'Usuário registrado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos ou incompletos',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email já registrado',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: 'Autenticar usuário',
    description: 'Faz login de um usuário e retorna um token JWT',
  })
  @ApiConsumes('application/json')
  @ApiBody({
    type: LoginDto,
    description: 'Credenciais de login',
    examples: {
      standardLogin: {
        summary: 'Login padrão',
        description: 'Exemplo de login com e-mail e senha',
        value: {
          email: 'usuario@exemplo.com',
          password: 'senha123',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login bem-sucedido, token JWT retornado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        email: { type: 'string', example: 'usuario@exemplo.com' },
        name: { type: 'string', example: 'Usuário Teste' },
        role: { type: 'string', example: 'CLIENT' },
        token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciais inválidas',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Formato de dados inválido',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
