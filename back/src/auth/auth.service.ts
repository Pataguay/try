import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    // const user = this.userRepository.create(dto);
    // return this.userRepository.save(user);
    return this.userService.create(dto);
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const payload = { sub: user.id, user: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, senha: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (user && (await bcrypt.compare(senha, user.password))) {
      return user;
    }
    return null;
  }
}
