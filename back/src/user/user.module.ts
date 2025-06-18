import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ClientProfile } from './entities/client-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ClientProfile])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Exportando o UserService para ser usado em outros módulos
})
export class UserModule {}
