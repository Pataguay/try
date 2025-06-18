import { ClientProfile } from 'src/user/entities/client-profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ClientProfile, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_profile_id' })
  clientProfile: ClientProfile;

  @Column({ name: 'client_profile_id' })
  clientProfileId: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    eager: true,
    cascade: true,
  })
  items: CartItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  deliveryFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;
}
