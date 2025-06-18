import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClientProfile } from '../../user/entities/client-profile.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column({ nullable: true })
  complement: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postalCode: string;

  @OneToOne(() => ClientProfile, (clientProfile) => clientProfile.address)
  @JoinColumn()
  clientProfile: ClientProfile;

  @Column({ nullable: true })
  clientProfileId: number;
}
