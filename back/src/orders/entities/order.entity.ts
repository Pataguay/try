import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClientProfile } from '../../user/entities/client-profile.entity';
import { Store } from '../../store/entities/store.entity';
import { Address } from '../../address/entities/address.entity';
import { OrderStatus } from './order-status.enum';
import { OrderItem } from './order-item.entity';
import { Review } from '../../reviews/entities/review.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ClientProfile, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_profile_id' })
  clientProfile: ClientProfile;

  @Column({ name: 'client_profile_id' })
  clientProfileId: number;

  @ManyToOne(() => Store, { eager: true })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ name: 'store_id' })
  storeId: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    eager: true,
    cascade: true,
  })
  items: OrderItem[];

  @ManyToOne(() => Address, { eager: true })
  @JoinColumn({ name: 'delivery_address_id' })
  deliveryAddress: Address;

  @Column({ name: 'delivery_address_id' })
  deliveryAddressId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  deliveryFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({
    type: 'simple-enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @CreateDateColumn({ name: 'order_date_time' })
  orderDateTime: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'delivery_date_time', nullable: true })
  deliveryDateTime: Date;

  @Column({ name: 'payment_method', nullable: true })
  paymentMethod: string;

  @Column({ name: 'payment_status', default: 'PENDING' })
  paymentStatus: string;

  @Column({ name: 'payment_date', nullable: true })
  paymentDate: Date;

  @OneToMany(() => Review, (review) => review.order)
  reviews: Review[];
}
