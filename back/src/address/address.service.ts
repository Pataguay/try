import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly userService: UserService,
  ) {}

  async create(
    createAddressDto: CreateAddressDto,
    userId: number,
  ): Promise<Address> {
    const clientProfile = await this.userService.getClientProfile(userId);

    await this.assertClientHasNoAddress(clientProfile.id);

    const createdAddress = this.addressRepository.create({
      ...createAddressDto,
      clientProfile,
    });
    return await this.addressRepository.save(createdAddress);
  }

  async findOne(userId: number): Promise<Address> {
    const clientProfile = await this.userService.getClientProfile(userId);

    const address = await this.addressRepository.findOne({
      where: { clientProfile: { id: clientProfile.id } },
      relations: ['clientProfile'],
    });

    if (!address) {
      throw new NotFoundException('Address not found for this user');
    }

    return address;
  }

  async update(updateAddressDto: UpdateAddressDto, userId: number) {
    const addressToUpdate = await this.findOne(userId);
    Object.assign(addressToUpdate, updateAddressDto);

    return this.addressRepository.save(addressToUpdate);
  }

  private async assertThatAddressExists(userId: number): Promise<void> {
    await this.findOne(userId);
  }

  private async assertClientHasNoAddress(userId: number): Promise<void> {
    const existingAddress = await this.addressRepository.findOne({
      where: { clientProfileId: userId },
    });

    if (existingAddress) {
      throw new ConflictException('Address already exists for this user');
    }
  }
}
