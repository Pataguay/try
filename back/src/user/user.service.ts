import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/auth.dto';
import { User } from './entities/user.entity';
import { UserRole } from './entities/enums/user-role';
import { ClientProfile } from './entities/client-profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateAuthDto } from '../auth/dto/update-auth.dto';
import { ProducerProfile } from './entities/producer-profile.entity';
import { CourierProfile } from './entities/courier-profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: RegisterDto): Promise<User> {
    await this.assertThatEmailAlreadyExists(dto.email);

    const newUser = new User();
    newUser.name = dto.name;
    newUser.email = dto.email;
    newUser.password = dto.password;
    newUser.role = dto.role;

    if (dto.role == UserRole.CLIENT) {
      console.log('Creating a client profile');
      const clientProfile = new ClientProfile();

      if (dto.cpf) {
        clientProfile.cpf = dto.cpf;
        await this.assertThatCpfAlreadyExists(dto.cpf);
      }

      newUser.clientProfile = clientProfile;
    }

    if (dto.role == UserRole.PRODUCER) {
      console.log('Creating a producer profile');
      const producerProfile = new ProducerProfile();

      if (dto.cnpj) {
        await this.assertThatCnpjAlreadyExists(dto.cnpj);
        producerProfile.cnpj = dto.cnpj;
      }

      newUser.producerProfile = producerProfile;
    }

    if (dto.role == UserRole.COURIER) {
      console.log('Creating a courier profile');
      const courierProfile = new CourierProfile();

      if (dto.cpf) {
        await this.assertThatCpfAlreadyExists(dto.cpf);
        courierProfile.cpf = dto.cpf;
      }

      if (dto.cnh) {
        courierProfile.cnh = dto.cnh;
        await this.assertThatCnhAlreadyExists(dto.cnh);
      }

      if (dto.vehicleType) {
        courierProfile.vehicleType = dto.vehicleType;
      }

      newUser.courierProfile = courierProfile;
    }

    const userToSave = this.userRepository.create(newUser);
    return this.userRepository.save(userToSave);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findClientProfileByUserId(userId: number): Promise<ClientProfile> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['clientProfile'],
    });

    if (!user || !user.clientProfile) {
      throw new NotFoundException(
        `Client profile not found for user with id ${userId}`,
      );
    }

    return user.clientProfile;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['clientProfile'],
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateAuthDto): Promise<User> {
    const userToUpdate = await this.findOne(id);
    Object.assign(userToUpdate, updateUserDto);

    return this.userRepository.save(userToUpdate);
  }

  async remove(id: number): Promise<void> {
    await this.assertThatUserExists(id);
    await this.userRepository.delete(id);
  }

  async assertThatUserExists(id: number): Promise<void> {
    await this.findOne(id);
  }

  async assertThatEmailAlreadyExists(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) {
      throw new NotFoundException(`User with email ${email} already exists`);
    }
  }

  async assertThatCpfAlreadyExists(cpf: string): Promise<void> {
    // TODO: Esse método não está funcionando corretamente - por que ele não verifica todos os CPF
    // cadastrados, apenas os dos clientes.

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.clientProfile', 'clientProfile')
      .where('clientProfile.cpf = :cpf', { cpf })
      .getOne();

    if (user) {
      throw new NotFoundException(`User with CPF ${cpf} already exists`);
    }
  }

  async assertThatCnpjAlreadyExists(cnpj: string): Promise<void> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.producerProfile', 'producerProfile')
      .where('producerProfile.cnpj = :cnpj', { cnpj: cnpj })
      .getOne();

    if (user) {
      throw new NotFoundException(`User with CNPJ ${cnpj} already exists`);
    }
  }

  async assertThatCnhAlreadyExists(cnh: string) {
    // TODO: Implement this method
  }

  async getClientProfile(userId: number): Promise<ClientProfile> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['clientProfile'],
    });

    if (!user || !user.clientProfile) {
      throw new NotFoundException(
        `Perfil de cliente não encontrado para o usuário ${userId}`,
      );
    }

    return user.clientProfile;
  }
}
