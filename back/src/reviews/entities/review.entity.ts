import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClientProfile } from '../../user/entities/client-profile.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ name: 'client_profile_id' })
  clientProfileId: number;

  @Column({ name: 'order_id' })
  orderId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => ClientProfile, (client) => client.reviews)
  @JoinColumn({ name: 'client_profile_id' })
  clientProfile: ClientProfile;

  @ManyToOne(() => Order, (order) => order.reviews)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
