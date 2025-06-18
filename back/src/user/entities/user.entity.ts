import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ClientProfile } from './client-profile.entity';
import { UserRole } from './enums/user-role';
import { ProducerProfile } from './producer-profile.entity';
import { CourierProfile } from './courier-profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'simple-enum',
    enum: UserRole,
  })
  role: UserRole;

  @OneToOne(() => ClientProfile, (clientProfile) => clientProfile.user, {
    cascade: true,
    nullable: true,
    eager: true,
  })
  clientProfile?: ClientProfile;

  @OneToOne(() => ProducerProfile, (producerProfile) => producerProfile.user, {
    cascade: true,
    nullable: true,
    eager: true,
  })
  producerProfile?: ProducerProfile;

  @OneToOne(() => CourierProfile, (courierProfile) => courierProfile.user, {
    cascade: true,
    nullable: true,
    eager: true,
  })
  courierProfile?: CourierProfile;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
