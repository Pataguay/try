import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { VehicleType } from './enums/vehicle-type';

@Entity()
export class CourierProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  cnh?: string;

  @Column({ unique: true, nullable: false })
  cpf?: string;

  @Column({
    type: 'simple-enum',
    enum: VehicleType,
  })
  vehicleType: VehicleType;

  @OneToOne(() => User, (user) => user.courierProfile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
